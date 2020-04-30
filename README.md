neurolang-ipywidgets
===============================

A custom jupyter widget library for neurolang web application.

Installation
------------

To install use pip:

    $ pip install neurolang_ipywidgets
    $ jupyter nbextension enable --py --sys-prefix neurolang_ipywidgets

To install for jupyterlab

    $ jupyter labextension install neurolang_ipywidgets
	
To be able to run extensions in jupyterlab 
    $ jupyter labextension install @jupyter-widgets/jupyterlab-manager

For a development installation (requires npm),

    $ git clone https://github.com/NeuroLang/neurolang-ipywidgets.git
    $ cd neurolang-ipywidgets
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix neurolang_ipywidgets
    $ jupyter nbextension enable --py --sys-prefix neurolang_ipywidgets
    $ jupyter labextension install js

When actively developing your extension, build Jupyter Lab with the command:

    $ jupyter lab --watch

This take a minute or so to get started, but then allows you to hot-reload your javascript extension.
To see a change, save your javascript, watch the terminal for an update.

Note on first `jupyter lab --watch`, you may need to touch a file to get Jupyter Lab to open.

