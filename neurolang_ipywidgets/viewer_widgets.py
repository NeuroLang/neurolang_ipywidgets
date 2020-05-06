from ipywidgets import DOMWidget, register
from traitlets import Unicode, Bool, List
import numpy as np
import nibabel as nib
import base64
import json


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
    atlas = Any().tag(sync=True)

    # Todo validate mainView value

    @staticmethod
    def calculate_coords(image):
        """Calculates coordinates for the specified `image`."""
        coords = np.transpose(image.get_fdata().nonzero()).mean(0).astype(int)
        coords = nib.affines.apply_affine(image.affine, coords)
        return [int(c) for c in coords]

    @staticmethod
    def encode_image(image):
        nifti_image = nib.Nifti2Image(image.get_fdata(), affine=image.affine)
        encoded_image = base64.b64encode(nifti_image.to_bytes())
        return json.dumps(encoded_image)
