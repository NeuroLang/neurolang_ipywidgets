from traitlets import TraitType
import nibabel as nib
import base64


class Image(TraitType):
    """A trait type holding an image object"""

    default_value = None


def encode(image):
    nifti_image = nib.Nifti2Image(
        image.get_fdata(), affine=image.affine, header=image.header)
    encoded_image = base64.encodebytes(nifti_image.to_bytes())
    enc = encoded_image.decode("utf-8")
    return enc


def image_to_json(pydt, manager):
    """Serialize an image object to json.
    """
    if pydt is None:
        return None
    else:
        if isinstance(pydt, list):
            return [dict(image=encode(x[0]), config=x[1]) for x in pydt]
        else:
            return encode(pydt)


image_serialization = {
    'to_json': image_to_json
}
