from __future__ import print_function
from setuptools import setup, find_packages
import os
from os.path import join as pjoin
from distutils import log

from jupyter_packaging import (
    create_cmdclass,
    install_npm,
    ensure_targets,
    combine_commands,
    get_version,
)


here = os.path.dirname(os.path.abspath(__file__))

log.set_verbosity(log.DEBUG)
log.info('setup.py entered')
log.info('$PATH=%s' % os.environ['PATH'])

name = 'neurolang_ipywidgets'
LONG_DESCRIPTION = 'A custom jupyter widget library for neurolang web application.'

# Get neurolang_ipywidgets version
version = get_version(pjoin(name, '_version.py'))

js_dir = pjoin(here, 'js')

# Representative files that should exist after a successful build
jstargets = [
    pjoin(js_dir, 'dist', 'index.js'),
]

data_files_spec = [
    ('share/jupyter/nbextensions/neurolang-ipywidgets', 'neurolang_ipywidgets/nbextension', '*.*'),
    ('share/jupyter/labextensions/neurolang-ipywidgets', 'neurolang_ipywidgets/labextension', '**'),
    ('share/jupyter/labextensions/neurolang-ipywidgets', '.', 'install.json'),
    ('etc/jupyter/nbconfig/notebook.d', '.', 'neurolang-ipywidgets.json'),
]

cmdclass = create_cmdclass('jsdeps', data_files_spec=data_files_spec)
cmdclass['jsdeps'] = combine_commands(
    install_npm(js_dir, build_cmd='build:prod'), ensure_targets(jstargets),
)


setup_args = dict(
    name=name,
    version=version,
    description='A custom jupyter widget library for neurolang web application.',
    long_description=LONG_DESCRIPTION,
    include_package_data=True,
    install_requires=[
        'ipywidgets>=7.6.0',
        'numpy',
        'nibabel'
    ],
    packages=find_packages(),
    zip_safe=False,
    cmdclass=cmdclass,
    author='Hande Gözükan, Romain Primet, Demian Wassermann',
    author_email='hande.gozukan@inria.fr, romain.primet@inria.fr, demian.wassermann@inria.fr',
    url='https://github.com/NeuroLang/neurolang_ipywidgets',
    keywords=[
        'ipython',
        'jupyter',
        'widgets',
        'neurolang',
    ],
    classifiers=[
        'Development Status :: 4 - Beta',
        'Framework :: IPython',
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'Topic :: Multimedia :: Graphics',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
    ],
)

setup(**setup_args)
