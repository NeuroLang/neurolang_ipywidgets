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
