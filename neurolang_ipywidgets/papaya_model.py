import base64
import hashlib

from nibabel import Nifti2Image  # type: ignore

from traitlets import TraitType


def base64_encode_nifti(image):
    """Returns base64 encoded string of the specified image.

    Parameters
    ----------
    image : nibabel.Nifti2Image
        image to be encoded.

    Returns
    -------
    str
        base64 encoded string of the image.
    """
    encoded_image = base64.encodebytes(image.to_bytes())
    enc = encoded_image.decode("utf-8")
    return enc


class PapayaImage(TraitType):
    """A class that contains necessary information to display an image in papaya-viewer. This is meant to be an abstract class.
    """

    def __init__(self, image, config=None):
        """Instatiates an instance of the class with a unique id for the specified `image` and empty configuration.

        Parameters
        ----------
        image:
            image to display
        config : dict
            configuration parameters for the image. Possible keywords are:

            alpha : int
                the overlay image alpha level (0 to 1).
            lut : str
                the color table name.
            negative_lut : str
                the color table name used by the negative side of the parametric pair.
            max : int
                the display range maximum.
            maxPercent : int
                the display range maximum as a percentage of image max.
            min : int
                the display range minimum.
            minPercent : int
                the display range minimum as a percentage of image min.
           symmetric : bool
                if true, sets the negative range of a parametric pair to the same size as the positive range.
        """
        self.__id = self._generate_id(image)
        self.__image = image

        if config is None:
            self.__config = {}
        else:
            self.__config = config

    def _generate_id(self, image):
        """Returns hash of the specified `image`.

        Parameters
        ----------
        image:
            image from which the hash is generated.
        """
        m = hashlib.sha256()
        m.update(self._image_to_bytes(image))
        return m.hexdigest()

    def _image_to_bytes(self, image):
        raise ValueError("Image format not supported!")

    @property
    def id(self) -> str:
        """Returns the unique id of the image.

        Returns
        -------
        str
            unique id of the image.
        """
        return self.__id

    @property
    def image(self):
        """Returns the image.

        Returns
        -------
            the image.
        """
        return self.__image

    @property
    def config(self) -> dict:
        """Returns the configuration parameters for the image.

        Returns
        -------
        dict
            configuration parameters for the image. Possible keywords are:

            alpha : int
                the overlay image alpha level (0 to 1).
            lut : str
                the color table name.
            negative_lut : str
                the color table name used by the negative side of the parametric pair.
            max : int
                the display range maximum.
            maxPercent : int
                the display range maximum as a percentage of image max.
            min : int
                the display range minimum.
            minPercent : int
                the display range minimum as a percentage of image min.
           symmetric : bool
                if true, sets the negative range of a parametric pair to the same size as the positive range.
        """
        return self.__config

    @config.setter
    def config(self, config: dict):
        """Sets the configuration parameters for the image.

        Parameters
        ----------
        config : dict
            configuration parameters for the image. Possible keywords are:

            alpha : int
                the overlay image alpha level (0 to 1).
            lut : str
                the color table name.
            negative_lut : str
                the color table name used by the negative side of the parametric pair.
            max : int
                the display range maximum.
            maxPercent : int
                the display range maximum as a percentage of image max.
            min : int
                the display range minimum.
            minPercent : int
                the display range minimum as a percentage of image min.
           symmetric : bool
                if true, sets the negative range of a parametric pair to the same size as the positive range.
        """
        self.__config = config

    def base64_encode(self):
        return None

    # def __eq__(self, other):
    #     """Checks equality of two images by comparing IDs of the images. `config`s of the images can be different."""
    #     if not isinstance(other, PapayaImage):
    #         return False
    #     return self.__id == other.id


class PapayaSpatialImage(PapayaImage):
    """A class that contains necessary information to display an image of type nibabel.spatialimages.SpatialImage in papaya-viewer.
    """

    def __init__(self, image, config=None):
        super().__init__(image, config)

    def _image_to_bytes(self, image):
        return image.dataobj.tobytes()

    def base64_encode(self):
        image = self.image
        nifti_image = Nifti2Image(
            image.get_fdata(), affine=image.affine, header=image.header)

        return base64_encode_nifti(nifti_image)


class PapayaNiftiImage(PapayaImage):
    """A class that contains necessary information to display an image of type nibabel.Nifti2Image in papaya-viewer.
    """

    def __init__(self, image, config=None):
        super().__init__(image, config)

    def _image_to_bytes(self, image):
        return image.to_bytes()

    def base64_encode(self):
        return base64_encode_nifti(self.image)


class Image(TraitType):
    """A trait type holding an image object"""

    default_value = None


def papaya_image_to_json(pydt, manager):
    """Serialize an instance of PapayaImage class to json.
    """
    if pydt is None:
        return None
    else:
        if isinstance(pydt, list):
            return [dict(id=x.id, image=x.base64_encode(), config=x.config) for x in pydt]
        else:
            return dict(id=pydt.id, image=pydt.base64_encode(), config=pydt.config)


papaya_image_serialization = {
    'to_json': papaya_image_to_json
}


def image_to_json(pydt, manager):
    """Serialize an instance of Image class to json.
    """
    if pydt is None:
        return None
    else:
        if isinstance(pydt, list):
            return [base64_encode_nifti(x) for x in pydt]
        else:
            return base64_encode_nifti(pydt)


image_serialization = {
    'to_json': image_to_json
}
