import base64
from ipywidgets import CallbackDispatcher, Checkbox, CoreWidget, DOMWidget, register, Tab, VBox
from traitlets import Bool, Bytes, Float, Int, List, Unicode


@register
class NlLink(DOMWidget):
    """A widget to display links.


    Parameters
    ----------
    value: str
        text to display for the link.
    href: str
        URL of the link.
    """

    _view_name = Unicode("LinkView").tag(sync=True)
    _model_name = Unicode('LinkModel').tag(sync=True)
    _view_module = Unicode("neurolang-ipywidgets").tag(sync=True)
    _model_module = Unicode('neurolang-ipywidgets').tag(sync=True)

    _view_module_version = Unicode("0.1.0").tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)

    # Widget specific properties
    # value to appear as link text
    value = Unicode().tag(sync=True)
    # url of the link
    href = Unicode().tag(sync=True)

    # TODO check href to be a link


@register
class NlProgress(DOMWidget):
    """A widget to display progress as a horizontal bar.

    Parameters
    ----------
    value: float
         amount of progress.
    max: int
        maximum possible value.
    """

    _view_name = Unicode("ProgressView").tag(sync=True)
    _model_name = Unicode('ProgressModel').tag(sync=True)
    _view_module = Unicode("neurolang-ipywidgets").tag(sync=True)
    _model_module = Unicode('neurolang-ipywidgets').tag(sync=True)

    _view_module_version = Unicode("0.1.0").tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)

    # Widget specific properties
    # actual value
    value = Float().tag(sync=True)
    # maximum value
    max = Int().tag(sync=True)

    # TODO check value to be between 0 and max value inclusive.


@register
class NlCheckbox(Checkbox):
    """A Checkbox widget that changes opacity when disabled.

    Parameters
    ----------
    opacity: float
        opacity value for the checkbox when disabled.
    """

    _view_name = Unicode('NCheckboxView').tag(sync=True)
    _model_name = Unicode('NCheckboxModel').tag(sync=True)
    _view_module = Unicode("neurolang-ipywidgets").tag(sync=True)
    _model_module = Unicode('neurolang-ipywidgets').tag(sync=True)

    _view_module_version = Unicode("0.1.0").tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)

    # Widget specific properties
    # opacity value to be used when disabled.
    opacity = Float(0.45).tag(sync=True)
    bg_color = Unicode('white').tag(sync=True)

    # TODO check opacity value.


@register
class NlIconTab(Tab):
    _view_name = Unicode('IconTabView').tag(sync=True)
    _model_name = Unicode('IconTabModel').tag(sync=True)
    _view_module = Unicode("neurolang-ipywidgets").tag(sync=True)
    _model_module = Unicode('neurolang-ipywidgets').tag(sync=True)

    _view_module_version = Unicode("0.1.0").tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)

    # Widget specific properties
    title_icons = List().tag(sync=True)

    def reset(self):
        self.title_icons = []
        self.children = []


@register
class NlVBoxOverlay(VBox):
    """A VBox widget that is viewed as overlay.

    Parameters
    ----------
    """

    _view_name = Unicode('VBoxOverlayView').tag(sync=True)
    _model_name = Unicode('VBoxOverlayModel').tag(sync=True)
    _view_module = Unicode("neurolang-ipywidgets").tag(sync=True)
    _model_module = Unicode('neurolang-ipywidgets').tag(sync=True)

    _view_module_version = Unicode("0.1.0").tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)


def content_to_json(pydt, manager):
    """Serialize file content to json.
    """
    if pydt is None:
        return None
    else:
        b64 = base64.encodebytes(pydt).decode()
        return b64


content_serialization = {
    'to_json': content_to_json
}


@register
class NlDownloadLink(DOMWidget, CoreWidget):
    """A widget to download content as file with filename.


    Parameters
    ----------
    content: str
        content of the file as bytes
    filename: str
        file name
    mimetype: str
        text/csv by default
    description: str
        description for link
    tooltip: str
        tooltip to display when link hovered
    disabled: bool
        boolean value to indicate if the link is disabled
    """

    _view_name = Unicode("DownloadLinkView").tag(sync=True)
    _model_name = Unicode('DownloadLinkModel').tag(sync=True)
    _view_module = Unicode("neurolang-ipywidgets").tag(sync=True)
    _model_module = Unicode('neurolang-ipywidgets').tag(sync=True)

    _view_module_version = Unicode("0.1.0").tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)

    # Widget specific properties
    content = Bytes().tag(sync=True, **content_serialization)
    mimetype = Unicode("text/csv").tag(sync=True)
    filename = Unicode().tag(sync=True)
    description = Unicode().tag(sync=True)
    tooltip = Unicode("Download").tag(sync=True)
    disabled = Bool(False).tag(sync=True)

    # below lines are copied from button widget to handle click on the link

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._click_handlers = CallbackDispatcher()
        self.on_msg(self._handle_button_msg)

    # this is necessary when data is big and it content should not be set at when widget is initialized
    def on_click(self, callback, remove=False):
        """Register a callback to execute when the button is clicked.
        The callback will be called with one argument, the clicked button
        widget instance.
        Parameters
        ----------
        remove: bool (optional)
            Set to true to remove the callback from the list of callbacks.
        """
        self._click_handlers.register_callback(callback, remove=remove)

    def click(self):
        """Programmatically trigger a click event.
        This will call the callbacks registered to the clicked button
        widget instance.
        """
        self._click_handlers(self)

    def _handle_button_msg(self, _, content, buffers):
        """Handle a msg from the front-end.
        Parameters
        ----------
        content: dict
            Content of the msg.
        """
        if content.get('event', '') == 'click':
            self.click()
