from neurolang_ipywidgets import NlCodeEditor

n = NlCodeEditor("baz")
n

n.text

n.text = """import  bar

def foo()
    bar.baz()
"""

# Note that CodeMirror has a 0-index convention for line numbers
n.marks = [{"line": 0, "text": "parse error: \n    Expected something, got something else..."},
           {"line": 2, "text": "missing colon"}]

n.text_marks = [{"from": {"line": 0, "ch": 2}, "to": {"line": 0, "ch": 7}},
                {"from": {"line": 2, "ch": 2}, "to": {"line": 3, "ch": 7}}]

n.clear_marks()
