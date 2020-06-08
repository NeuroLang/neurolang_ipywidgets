from ipywidgets import DOMWidget, register
from traitlets import List, Unicode

@register
class NlCodeEditor(DOMWidget):
    """
    A code editor widget
    """

    _view_name = Unicode("CodeEditorView").tag(sync=True)
    _model_name = Unicode('CodeEditorModel').tag(sync=True)
    _view_module = Unicode("neurolang-ipywidgets").tag(sync=True)
    _model_module = Unicode('neurolang-ipywidgets').tag(sync=True)

    _view_module_version = Unicode("0.1.0").tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)

    text = Unicode().tag(sync=True)
    marks = List().tag(sync=True)
