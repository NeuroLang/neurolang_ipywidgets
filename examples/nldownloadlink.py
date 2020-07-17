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

dl_1 = NlDownloadLink(filename="random.csv", content=df_csv)
dl_1 

# #### Lazy download link

# +
# When files are big, this helps generate csv file only when link is clicked
dl_2 = NlDownloadLink(filename="random_lazy.csv")


def clicked(event):
    dl_2.content = df_csv

dl_2.on_click(clicked)
dl_2 
# -
# #### Named link with tooltip

dl_3 = NlDownloadLink(filename="random.csv", content=df_csv, 
                      html="<h3>random</h3>", tooltip="Download random.csv")
dl_3

# #### Disabled link

dl_4 = NlDownloadLink(filename="random.csv", tooltip="Download disabled", disabled=True)
dl_4

# # Download Nifti image


papaya_image = PapayaNiftiImage(nib.load("img/L_G_front_sup.nii"))

image_link = NlDownloadLink(filename="image.nii", content=papaya_image.image.to_bytes())
image_link

papaya_image_test = PapayaNiftiImage(nib.load("img/image.nii"))


