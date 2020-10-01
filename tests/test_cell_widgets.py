import pytest
from ipywidgets import Widget
from neurolang_ipywidgets import NlLink
from traitlets import TraitError


class TestNlLink:
    def teardown(self):
        for w in tuple(Widget.widgets.values()):
            w.close()

    def test_create(self):
        """Tests NlLink constructor with empty string values for both `href` and `value`."""
        widget = NlLink()
        assert (widget.value == "")
        assert (widget.href == "")

    def test_create_value(self):
        """Tests NlLink constructor setting non-empty string values for both
        `href` and `value`.
        """
        widget = NlLink(
            value="neurolang",
            href="https://github.com/NeuroLang/neurolang-ipywidgets"
        )

        assert (widget.value == "neurolang")
        assert (
            widget.href == "https://github.com/NeuroLang/neurolang-ipywidgets"
        )

    def test_create_value_none(self):
        """Tests NlLink constructor setting `value` as `None`."""
        with pytest.raises(TraitError):
            NlLink(value=None)

    def test_create_href_none(self):
        """Tests NlLink constructor setting `href` as `None`."""
        with pytest.raises(TraitError):
            NlLink(href=None)
