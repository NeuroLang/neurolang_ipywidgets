# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .py
#       format_name: light
#       format_version: '1.5'
#       jupytext_version: 1.5.1
#   kernelspec:
#     display_name: Python 3
#     language: python
#     name: python3
# ---

# +
from neurolang_ipywidgets import NlDownloadLink, PapayaNiftiImage

import gzip
from ipywidgets import Layout
import nibabel as nib
import numpy as np
import pandas as pd
# -

# ## Download CSV file

# ### Create dataframe

# +
# Set the seed for a reproducible sample
np.random.seed(0)

df = pd.DataFrame(np.random.randn(50, 3), columns=list('ABC'))
df.head()
# -

df_csv = df.to_csv(index=False).encode()

layout = Layout(width="30px")

# ### Download link

dl_1 = NlDownloadLink(filename="random.csv", content=df_csv, layout=layout)
dl_1

# ### Lazy download link

# +
# When files are big, this helps generate csv file only when link is clicked
dl_2 = NlDownloadLink(filename="random_lazy.csv", layout=layout)


def clicked(event):
    dl_2.content = df_csv


dl_2.on_click(clicked)
dl_2
# -
# ### Link for compressed data file

# +
compressed = gzip.compress(df_csv)

dl_3 = NlDownloadLink(filename="random_compressed.csv.gz", content=compressed,
                      mimetyle="application/gz", layout=layout)
dl_3
# -

# ### Named link with description and tooltip

dl_4 = NlDownloadLink(filename="random.csv", content=df_csv,
                      tooltip="Download random.csv", description="random.csv")
dl_4

# ### Disabled link

dl_5 = NlDownloadLink(filename="random.csv",
                      tooltip="Download disabled", disabled=True, layout=layout)
dl_5

# ## Download Nifti image


# ### Load image file

papaya_image = PapayaNiftiImage(nib.load("img/L_G_front_sup.nii"))

# ### Download image link

image_link_1 = NlDownloadLink(
    filename="image.nii", content=papaya_image.to_bytes(), layout=layout)
image_link_1

# this will give error if image.nii file is not downloaded in previous cell
papaya_image_1_test = PapayaNiftiImage(nib.load("img/image.nii"))

# ### Link for compressed image

compressed_image = gzip.compress(papaya_image.to_bytes())
image_link_2 = NlDownloadLink(
    filename="image.nii.gz", content=compressed_image, layout=layout)
image_link_2

papaya_image_2_test = PapayaNiftiImage(nib.load("img/image.nii.gz"))


