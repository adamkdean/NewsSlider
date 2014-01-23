function NewsSlider(id) {

    this.$s = function (s) {
        return $(this.sliderId + s);
    }

    this.sliderId = '#' + id + ' ';
    this.pageIndex = 0;
    this.pageCount = this.$s('.news__sliders .news__slider').length;
    this.pageWidth = this.$s('.news__sliders .news__slider').first().width();
    this.pageMargin = parseInt(this.$s('.news__sliders .news__slider').first().css("marginLeft").replace('px', ''));

    this.markerCount = this.$s('.news__markers .news__marker').length;
    this.markerWidth = this.$s('.news__markers .news__marker').first().width();
    this.markerMargin = parseInt(this.$s('.news__markers .news__marker').first().css("marginLeft").replace('px', ''));

    this.init = function () {
        this.initPages();
        this.initMarkers();
    };

    this.initPages = function () {
        var _this = this;
        
        if (this.pageCount > 0) {
            this.$s('.news__sliders .news__slider').each(function (index) {
                var left = (_this.pageWidth * index) + ((_this.pageMargin*2) * index);
                $(this).css('left', left);
            });
        } else {
            this.$s('.news__sliders').hide();
        }

        this.$s('.news__sliders .news__slider').css('display', 'block');
    };

    this.initMarkers = function () {
        var markerDivWidth = (this.markerCount*this.markerWidth) + ((this.markerMargin*2) * this.markerCount);

        this.$s('.news__markers').width(markerDivWidth);
        this.$s('.news__markers .news__marker').first().addClass('active');
    };

    this.changePage = function () {
        var _this = this;

        this.$s('.news__sliders .news__slider').each(function (index) {
            var effectiveIndex = (index - _this.pageIndex),
                left = (_this.pageWidth * effectiveIndex) + ((_this.pageMargin*2) * effectiveIndex);
            $(this).css('left', left);
        });
    };

    this.previous = function () {
        this.pageIndex = (this.pageIndex >= 0) ? this.pageIndex - 1 : -2;
        this.changePage();
    };

    this.next = function () {
        this.pageIndex = (this.pageIndex < this.pageCount - 1) ? this.pageIndex + 1 : this.pageCount - 1;
        this.changePage();
    };

    this.select = function (articleId) {
        this.selectArticle(articleId);
        this.selectMarker(articleId);
    };

    this.selectArticle = function (articleId) {
        this.$s('.news__articles .news__article').each(function (index) {
            var thisId = $(this).attr('id');

            if (thisId === articleId) { 
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    };

    this.selectMarker = function (articleId) {
        var _this = this;

        this.$s('.news__markers .news__marker').each(function (index) {
            var thisHash = $(this).attr('href').replace(/^.*?(#|$)/,'');

            if (thisHash === articleId) { 
                $(this).addClass('active');
                _this.pageIndex = index - 1;
                _this.changePage();
            } else {
                $(this).removeClass('active');
            }
        });
    };
}

$(function () {
    var newsSliders = {},
        newsSlider,
        newsSliderId;

    $('.news').each(function (e) {
        newsSliderId = $(this)[0].id;
        newsSlider = new NewsSlider(newsSliderId);
        newsSlider.init();
        newsSliders[newsSliderId] = newsSlider;
    });

    $('.news__controls .news__prev').click(function(e) {
        var $controls = $(this).parent(),
            $slider = $($controls).parent(),
            instance = newsSliders[$slider[0].id];
        instance.previous();
    });

    $('.news__controls .news__next').click(function(e) {
        var $controls = $(this).parent(),
            $slider = $($controls).parent(),
            instance = newsSliders[$slider[0].id];
        instance.next();
    });

    $('.news__controls .news__slider').click(function(e) {
        var $sliders = $(this).parent(),
            $controls = $($sliders).parent(),
            $slider = $($controls).parent(),
            instance = newsSliders[$slider[0].id],
            hash = $(this).attr('href').replace(/^.*?(#|$)/,'');
        instance.select(hash);
    });

    $('.news__markers .news__marker').click(function(e) {
        var $markers = $(this).parent(),
            $slider = $($markers).parent(),
            instance = newsSliders[$slider[0].id],
            hash = $(this).attr('href').replace(/^.*?(#|$)/,'');
        instance.select(hash);
    });
});