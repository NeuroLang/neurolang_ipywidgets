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

# #### Download link

download_link = NlDownloadLink(filename="random.csv", content=df_csv)
download_link

# #### Lazy download link

# +
# When files are big, this helps generate csv file only when link is clicked
download_link_lazy = NlDownloadLink(filename="random_lazy.csv")


def clicked(event):
    download_link_lazy.content = df_csv

download_link_lazy.on_click(clicked)
download_link_lazy
# -
# # Download Nifti image


papaya_image = PapayaNiftiImage(nib.load("img/L_G_front_sup.nii"))

image_link = NlDownloadLink(filename="image.nii", content=papaya_image.image.to_bytes())
image_link

papaya_image_test = PapayaNiftiImage(nib.load("img/image.nii"))


