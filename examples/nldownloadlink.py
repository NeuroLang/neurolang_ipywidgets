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

from neurolang_ipywidgets import NlDownloadLink
import numpy as np
import pandas as pd

# ## Create dataframe

# +
# Set the seed for a reproducible sample
np.random.seed(0)  

df = pd.DataFrame(np.random.randn(50, 3), columns=list('ABC'))
df.head()
# -

# ### Download link

download_link = NlDownloadLink(filename="random.csv", content=df.to_csv(index=False))
download_link

# ### Lazy download link

# +
# When files are big, this helps generate csv file only when link is clicked
download_link_lazy = NlDownloadLink(filename="random_lazy.csv")


def clicked(event):
    download_link_lazy.content = df.to_csv()

download_link_lazy.on_click(clicked)
download_link_lazy
# -


