from ipywidgets import Checkbox, DOMWidget, register, Tab, VBox
from traitlets import Unicode, Float, Int, List


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
