from neurolang_ipywidgets import NlCodeEditor


def test_create():
    widget = NlCodeEditor()
    assert(type(widget) == NlCodeEditor)
    assert(widget.text == "")

def test_create_with_init_value():
    widget = NlCodeEditor("hi there")
    assert(type(widget) == NlCodeEditor)
    assert(widget.text == "hi there")
