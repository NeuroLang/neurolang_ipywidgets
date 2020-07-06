from ipywidgets import DOMWidget, register
from traitlets import Bool, List, Unicode, Int
import numpy as np
import nibabel as nib
from copy import deepcopy

from .papaya_model import Image, image_serialization, papaya_image_serialization


class LutOptions:

    def __init__(self):
        self.__custom_luts = {
            "lut0": {
                "data": [[0, 0.8, 0, 0],
                         [1, 0.8, 0, 0]],
                "gradation": False,
                "hex": "#cc0000"
            },
            "lut1": {
                "data": [[0, 1, 0.9, 0],
                         [1, 1, 0.9, 0]],
                "gradation": False,
                "hex": "#ffe400"
            },
            "lut2": {
                "data": [[0, 0.49, 0.66, 0.14],
                         [1, 0.49, 0.66, 0.14]],
                "gradation": False,
                "hex": "#7ca923"
            },
            "lut3": {
                "data": [[0, 0, 1, 1],
                         [1, 0, 1, 1]],
                "gradation": False,
                "hex": "#00FFFF"
            },
            "lut4": {
                "data": [[0, 0.1, 0.56, 1],
                         [1, 0.1, 0.56, 1]],
                "gradation": False,
                "hex": "#1c90fd"
            },
            "lut5": {
                "data": [[0, 1, 0, 1],
                         [1, 1, 0, 1]],
                "gradation": False,
                "hex": "#ff00ff"
            },
            "lut6": {
                "data": [[0, 0.3, 0, 0.5],
                         [1, 0.3, 0, 0.5]],
                "gradation": False,
                "hex": "#4f0080"
            },
            "lut7": {
                "data": [[0, 1, 0.25, 0],
                         [1, 1, 0.25, 0]],
                "gradation": False,
                "hex": "#ff4000"
            },
        }

        self.__options = list(self.__custom_luts.keys())

    def next(self):
        if len(self.__options) > 0:
            return self.__options.pop(0)
        else:
            return None

    def return_lut(self, lut):
        if lut is not None:
            self.__options.append(lut)

    def get_hex(self, lut):
        return self.__custom_luts.get(lut, None).get("hex", None)

    def get_luts(self):
        return [dict(name=lut, data=v['data'], gradation=v["gradation"]) for lut, v in self.__custom_luts.items()]


@register
class NlPapayaViewer(DOMWidget):
    """A widget to display papaya viewer.

    """

    MAX_IMAGE_COUNT = 8

    _view_name = Unicode("PapayaView").tag(sync=True)
    _model_name = Unicode('PapayaModel').tag(sync=True)
    _view_module = Unicode("neurolang-ipywidgets").tag(sync=True)
    _model_module = Unicode('neurolang-ipywidgets').tag(sync=True)

    _view_module_version = Unicode("0.1.0").tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)

    # these are not updated when changed, as papaya expects them to be set
    # once upon initialization
    worldSpace = Bool(True).tag(sync=True)
    kioskMode = Bool(True).tag(sync=True)
    fullScreen = Bool(False).tag(sync=True)
    allowScroll = Bool(True).tag(sync=True)
    showControls = Bool(True).tag(sync=True)
    showControlBar = Bool(True).tag(sync=True)
    showImageButtons = Bool(False).tag(sync=True)
    orthogonal = Bool(True).tag(sync=True)
    mainView = Unicode('axial').tag(sync=True)

    # these can be changed
    coordinate = List().tag(sync=True)
    atlas = Image().tag(sync=True, **image_serialization)
    images = List().tag(sync=True, **papaya_image_serialization)
    error = Unicode().tag(sync=True)

    # shows/hides colorbar
    colorbar = Bool(True).tag(sync=True)
    # sets image index for colorbar, 0 displays colorbar for the atlas
    colorbar_index = Int(0).tag(sync=True)
    luts = List([]).tag(sync=True)

    # Todo validate mainView value

    def __init__(self, **kwargs):
        super(DOMWidget, self).__init__(**kwargs)
        if self.atlas is None:
            self.atlas = nib.load("avg152T1_brain.nii.gz")

        self.coordinate = NlPapayaViewer.calculate_coords(self.atlas)
        self.center_widget = None
        self.all_images = []
        self.__lut = LutOptions()
        self.luts = self.__lut.get_luts()

    @staticmethod
    def calculate_coords(image):
        """Calculates coordinates for the specified `image`."""
        if image is None:
            raise ValueError("Please specify a valid image!")
        coords = np.transpose(image.get_fdata().nonzero()).mean(0).astype(int)
        coords = nib.affines.apply_affine(image.affine, coords)
        return [int(c) for c in coords]

    def _get_image_index(self, image):
        """Returns the index of the specified `image` in the image list.

        Parameters
        ----------
        image:
            image for which index is required.

        Returns
        -------
        int
            index of the specified `image` in the image list; -1 if the image is not in the list or the specified image is `None`.
        """
        if image is None:
            return -1

        index = 0
        for im in self.all_images:
            if im.id == image.id:
                return index
            index = index + 1
        return -1

    def can_add(self, images):
        """Check if image list contains enough space to add the specified `images`.

        Parameters
        ----------
        images: iterable
            the list of images to add.
        """
        if images is None:
            return False
        return (len(self.all_images) + len(images)) <= 8

    def add(self, images):
        """Adds the images in the specified `images` list if there is enough space in the image list. Displays error otherwise.

        Parameters
        ----------
        images: iterable
            the list of images to add.
        """
        if (self.can_add(images)):
            for image in images:
                if image.is_label:
                    image.config["lut"] = self.__lut.next()
                self.all_images.append(image)
            self.set_images()
            # show colorbar for last added image
            self.show_image_colorbar_at_index(len(self.all_images))
        else:
            self.set_error(
                "Papaya viewer does not allow more than 8 overlays. \nPlease unselect a region to be able to add a new one!")

    def remove(self, images):
        # get index of image whose colorbar is displayed
        colorbar_image = self.get_colorbar_image()

        removed = False
        for image in images:
            # check if colorbar image is removed
            if image.id == colorbar_image.id:
                self.__lut.return_lut(image.config.get("lut", None))
                removed = True
            self.all_images.remove(image)
        self.set_images()

        # set new colorbar index
        if removed:
            self.show_image_colorbar_at_index(len(self.all_images))
        else:
            self.show_image_colorbar(colorbar_image)

    def set_images(self):
        self.images = deepcopy(self.all_images)

    def set_center(self, widget, image):
        if widget is not None and image is not None:
            if self.center_widget is not None:
                self.center_widget.remove_center()
            self.center_widget = widget
            self.coordinate = NlPapayaViewer.calculate_coords(image.image)

    def set_error(self, error):
        self.error = error
        # TODO does not propagate error="" in js side to python, so I use the below line to reset error, solve this
        self.error = ""

    def show_image_colorbar_at_index(self, index):
        """Displays the color bar for the image at specified `index`.

        Parameters
        ----------
        index: int
            zero-based index of the image. Zero corresponds to atlas image.
        """
        if index > len(self.images) or index < 0:
            raise ValueError(f"Invalid image index {index}!")
        self.colorbar_index = index

    def show_image_colorbar(self, image):
        """Displays the color bar for the specified `image`.

        Parameters
        ----------
        image
            image for which to display colorbar.
        """

        index = self._get_image_index(image)
        if index < 0:
            raise ValueError("Specified image is not in viewer's list.")
        else:
            self.show_image_colorbar_at_index(index + 1)

    def get_colorbar_image(self):
        """Returns the image for which the colorbar is displayed.

        Returns
        -------
           the image for which colorbar is displayed; None if the colorbar is displayed for atlas.
        """
        if self.colorbar_index == 0:
            return None
        else:
            return self.all_images[self.colorbar_index - 1]

    def reset(self):
        """Resets this viewer to its initial values."""
        self.images = []
        self.all_images = []

        self.worldSpace = True
        self.kioskMode = True
        self.fullScreen = False
        self.allowScroll = True
        self.showControls = True
        self.showControlBar = True
        self.showImageButtons = True
        self.orthogonal = True
        self.mainView = 'axial'

        self.atlas = nib.load("avg152T1_brain.nii.gz")
        self.coordinate = NlPapayaViewer.calculate_coords(self.atlas)
        self.center_widget = None

        self.error = ""
        self.colorbar = True
        self.colorbar_index = 0

    def get_hex_for_lut(self, lut):
        return self.__lut.get_hex(lut)
