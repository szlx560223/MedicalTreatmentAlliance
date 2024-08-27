/**
 * Created by Administrator on 2017/5/24.
 */

$(function () {
    // 全局的checkbox选中和未选中的样式
    var $allCheckbox = $('input[type="checkbox"]'),
        $sonCheckBox = $('.son_check'); // 每个商铺下的商品的checkbox
    
    $sonCheckBox.click(function () {
        if ($(this).is(':checked')) {
            $(this).next('label').addClass('mark');
            totalMoney();
        } else {
            $(this).next('label').removeClass('mark');
            totalMoney();
        }
    });

    console.log(1);

    // 商品数量
    var $plus = $('.plus'),
        $reduce = $('.reduce'),
        $all_sum = $('.sum');

    $plus.click(function () {
        var $inputVal = $(this).prev('input'),
            $count = parseInt($inputVal.val()) + 1,
            $obj = $(this).parents('.amount_box').find('.reduce'),
            $priceTotalObj = $(this).parents('.order_lists').find('.sum_price'),
            $price = $(this).parents('.order_lists').find('.price').html(), // 单价
            $priceTotal = $count * parseInt($price.substring(1));

        $inputVal.val($count);
        $priceTotalObj.html('￥' + $priceTotal);

        if ($inputVal.val() > 1 && $obj.hasClass('reSty')) {
            $obj.removeClass('reSty');
        }

        totalMoney();
    });

    $reduce.click(function () {
        var $inputVal = $(this).next('input'),
            $count = parseInt($inputVal.val()) - 1,
            $priceTotalObj = $(this).parents('.order_lists').find('.sum_price'),
            $price = $(this).parents('.order_lists').find('.price').html(), // 单价
            $priceTotal = $count * parseInt($price.substring(1));

        if ($inputVal.val() > 1) {
            $inputVal.val($count);
            $priceTotalObj.html('￥' + $priceTotal);
        }

        if ($inputVal.val() == 1 && !$(this).hasClass('reSty')) {
            $(this).addClass('reSty');
        }

        totalMoney();
    });

    $all_sum.keyup(function () {
        var $count = 0,
            $priceTotalObj = $(this).parents('.order_lists').find('.sum_price'),
            $price = $(this).parents('.order_lists').find('.price').html(), // 单价
            $priceTotal = 0;

        if ($(this).val() == '') {
            $(this).val('1');
        }

        $(this).val($(this).val().replace(/\D|^0/g, ''));
        $count = $(this).val();
        $priceTotal = $count * parseInt($price.substring(1));
        $(this).attr('value', $count);
        $priceTotalObj.html('￥' + $priceTotal);
        totalMoney();
    });

    $('.calBtn').click(function () {
        $.sendConfirm({
            withCenter: true,
            title: '预约确认',
            msg: '您确定要预约此医院吗？',
            button: {
                confirm: '确认',
                cancel: '取消',
                cancelFirst: true
            },
            onConfirm: function () {
                // 在这里根据每个医院的链接设置目标URL
                var hospitalLink = 'https://www.dg-tcm.com/h_zhongyiyuan/yygh/202110/31ec71c5ab244243b3d4ea0dabb81a91.shtml'; // 用你的医院链接替换这个链接
                window.location.href = hospitalLink;
            },
            onCancel: function () {
                $.sendMsg('预约失败', 3000, function () {
                    console.log('sendMsg closed');
                });
            },
            onClose: function () {
                $.sendMsg('预约失败', 3000, function () {
                    console.log('sendMsg closed');
                });
                console.log('点击关闭！');
            }
        });
    });
    // 移除商品（部分代码被注释）
    // var $order_lists = null;
    // var $order_content = '';
    // var namer;
    // $('.delBtn').click(function () {
    //     $order_lists = $(this).parents('.order_lists');
    //     $order_content = $order_lists.parents('.order_content');
    //     namer= $(this).parents('.order_lists').find('.list_text').html();
    //     name=namer.split(">")[1].split("<")[0]
    //     console.log(name.length)
        
    //     $('.model_bg').fadeIn(300);
    //     $('.my_model').fadeIn(300);
    // });

    // // 其他部分代码被注释，因此需要取消注释和适应整体逻辑
    // // ...

    // 总计（部分代码被注释）
    // function totalMoney() {
    //     // ...
    // }

});
