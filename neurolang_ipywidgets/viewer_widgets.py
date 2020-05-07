from ipywidgets import DOMWidget, register
from traitlets import Unicode, Bool, List, Any
import numpy as np
import nibabel as nib
import base64


def encode_image(image, widget):
    if image is not None:
        nifti_image = nib.Nifti2Image(image.get_fdata(), affine=image.affine)
        encoded_image = base64.encodebytes(nifti_image.to_bytes())
        enc = encoded_image.decode("utf-8")
        return enc


@register
class NlPapayaViewer(DOMWidget):
    """A widget to display papaya viewer.

    """

    _view_name = Unicode("PapayaView").tag(sync=True)
    _model_name = Unicode('PapayaModel').tag(sync=True)
    _view_module = Unicode("neurolang-ipywidgets").tag(sync=True)
    _model_module = Unicode('neurolang-ipywidgets').tag(sync=True)

    _view_module_version = Unicode("0.1.0").tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)

    worldSpace = Bool(True).tag(sync=True)
    kioskMode = Bool(True).tag(sync=True)
    fullScreen = Bool(False).tag(sync=True)
    allowScroll = Bool(True).tag(sync=True)
    showControls = Bool(True).tag(sync=True)
    showControlBar = Bool(True).tag(sync=True)
    orthogonal = Bool(True).tag(sync=True)
    mainView = Unicode('axial').tag(sync=True)
    coordinate = List().tag(sync=True)
    atlas = Any().tag(sync=True, to_json=encode_image)

    # Todo validate mainView value

    def __init__(self, **kwargs):
        super(DOMWidget, self).__init__(**kwargs)
        self.atlas = nib.load("avg152T1_brain.nii.gz")

    @staticmethod
    def calculate_coords(image):
        """Calculates coordinates for the specified `image`."""
        coords = np.transpose(image.get_fdata().nonzero()).mean(0).astype(int)
        coords = nib.affines.apply_affine(image.affine, coords)
        return [int(c) for c in coords]
