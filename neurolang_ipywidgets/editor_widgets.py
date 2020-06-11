from ipywidgets import DOMWidget, register
from traitlets import List, Unicode


@register
class NlCodeEditor(DOMWidget):
    """
    A code editor widget
    """

    _view_name = Unicode("CodeEditorView").tag(sync=True)
    _model_name = Unicode("CodeEditorModel").tag(sync=True)
    _view_module = Unicode("neurolang-ipywidgets").tag(sync=True)
    _model_module = Unicode("neurolang-ipywidgets").tag(sync=True)

    _view_module_version = Unicode("0.1.0").tag(sync=True)
    _model_module_version = Unicode("^0.1.0").tag(sync=True)

    text = Unicode().tag(sync=True)

    # marks should be a list of dicts containing keys "line" and "text"
    # lines are 0-indexed (CodeMirror convention)
    # e.g. [{line: 3, text: "parse error: expected end of file"}]
    marks = List().tag(sync=True)

    # text_marks should be a list of dict containing "from" and "to"
    # keys, with values of the form {"line" : line, "ch": ch}
    # e.g. [{"from": {"line": 0, "ch": 2}, "to": {"line": 0, "ch": 7}}]
    # Note that lines and characters/columns are 0-indexed
    text_marks = List().tag(sync=True)

    def __init__(self, text=None, **kwargs):
        if text is not None:
            self.text = text
        super().__init__(**kwargs)

    def clear_marks(self):
        """
        Removes all gutter and text marks
        """
        self.marks = []
        self.text_marks = []
