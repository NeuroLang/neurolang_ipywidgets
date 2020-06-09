from neurolang_ipywidgets import NlCodeEditor

n = NlCodeEditor("baz")
n

n.text

n.text = """import  bar

def foo()
    bar.baz()
"""

n.marks = [{"line": 0, "text": "parse error: \n    Expected something, got something else..."},
          {"line": 2, "text": "missing colon"}]


