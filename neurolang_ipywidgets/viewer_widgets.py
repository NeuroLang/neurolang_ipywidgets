from ipywidgets import DOMWidget, register
from traitlets import Unicode


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
