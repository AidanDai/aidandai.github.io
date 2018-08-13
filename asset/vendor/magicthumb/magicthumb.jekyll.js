/**
 *  magicthumb.js 对 jekyll 站内的图片处理
 *  依赖 jquery 库
 *  v1.0 加入 magicthumb.js 可对图片进行缩放
 */
$(function () {
    $("img").each(function (index) {
        var $img = $(this);
        var thumb = 'data-thumb-id="thumb' + index + '"';

        $img.before('<a class="MagicThumb" ' + thumb + ' href="' + $img.attr("src") + '"></a>');
        $img.prev('.MagicThumb').append($img);
        // reload all Magic Thumb images
        MagicThumb.refresh();
    });
})
