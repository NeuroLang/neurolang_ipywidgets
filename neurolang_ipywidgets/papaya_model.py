from uuid import uuid4


class PapayaImage:
    """A class that contains necessary information to display an image in papaya-viewer.
    """

    def __init__(self, image, config=None):
        """Instatiates an instance of the class with a unique id for the specified `image` and empty configuration.

        Parameters
        ----------
        image:
            image to display
        """
        self.__id = str(uuid4()).replace("-", "")
        self.__image = image
        if config is None:
            self.__config = {}
        else:
            self.__config = config

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
