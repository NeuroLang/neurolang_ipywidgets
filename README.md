neurolang_ipywidgets
===============================

A custom jupyter widget library for neurolang web application.

Installation
------------

To install use pip:

    $ pip install neurolang_ipywidgets

For a development installation (requires [Node.js](https://nodejs.org)),

    $ git clone https://github.com/NeuroLang/neurolang_ipywidgets.git
    $ cd neurolang_ipywidgets
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --overwrite --sys-prefix neurolang_ipywidgets
    $ jupyter nbextension enable --py --sys-prefix neurolang_ipywidgets

When actively developing your extension for JupyterLab, run the command:

    $ jupyter labextension develop --overwrite neurolang_ipywidgets

Then you need to rebuild the JS when you make a code change:

    $ cd js
    $ npm run build

You then need to refresh the JupyterLab page when your javascript changes.
