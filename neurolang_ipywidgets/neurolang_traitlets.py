import traitlets
import nibabel as nib
import base64


class Image(traitlets.TraitType):
    """A trait type holding an image object"""

    default_value = None


def image_to_json(pydt, manager):
    """Serialize an image object to json.
    """
    if pydt is None:
        return None
    else:
        nifti_image = nib.Nifti2Image(pydt.get_fdata(), affine=pydt.affine)
        encoded_image = base64.encodebytes(nifti_image.to_bytes())
        enc = encoded_image.decode("utf-8")
        return enc


image_serialization = {
    'to_json': image_to_json
}
