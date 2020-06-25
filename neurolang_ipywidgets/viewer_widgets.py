from ipywidgets import DOMWidget, register
from traitlets import Bool, List, Unicode, Int
import numpy as np
import nibabel as nib
from copy import deepcopy

from .papaya_model import Image, image_serialization, papaya_image_serialization


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
    showImageButtons = Bool(True).tag(sync=True)
    orthogonal = Bool(True).tag(sync=True)
    mainView = Unicode('axial').tag(sync=True)

    # these can be changed
    coordinate = List().tag(sync=True)
    atlas = Image().tag(sync=True, **image_serialization)
    images = List().tag(sync=True, **papaya_image_serialization)
    error = Unicode().tag(sync=True)

    colorbar = Bool(False).tag(sync=True)
    colorbar_index = Int(0).tag(sync=True)

    # Todo validate mainView value

    def __init__(self, **kwargs):
        super(DOMWidget, self).__init__(**kwargs)
        if self.atlas is None:
            self.atlas = nib.load("avg152T1_brain.nii.gz")
        self.reset()

    @staticmethod
    def calculate_coords(image):
        """Calculates coordinates for the specified `image`."""
        coords = np.transpose(image.get_fdata().nonzero()).mean(0).astype(int)
        coords = nib.affines.apply_affine(image.affine, coords)
        return [int(c) for c in coords]

    def can_add(self, images):
        return (len(self.all_images) + len(images)) <= 8

    def add(self, images):
        if (self.can_add(images)):
            for image in images:
                self.all_images.append(image)
            self.set_images()
        else:
            self.set_error(
                "Papaya viewer does not allow more than 8 overlays. \nPlease unselect a region to be able to add a new one!")

    def remove(self, images):
        for image in images:
            self.all_images.remove(image)
        self.set_images()

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
        if index > len(self.images):
            raise ValueError(f"Invalid image index {index}!")
        self.colorbar_index = index

    def show_image_colorbar(self, image):
        """Displays the color bar for the specified `image`.

        Parameters
        ----------
        image
            image for which to display colorbar.
        """

        index = self._is_image_in_list(image)
        if index < 0:
            raise ValueError("Specified image is not in viewer's list.")
        else:
            self.show_image_colorbar_at_index(index + 1)

    def reset(self):
        self.images = []
        self.coordinate = NlPapayaViewer.calculate_coords(self.atlas)
        self.center_widget = None
        self.all_images = []
        self.error = ""

        # TODO reset other values

    def _is_image_in_list(self, image):
        index = 0
        for im in self.images:
            if im.id == image.id:
                return index
            index = index + 1
        return False
