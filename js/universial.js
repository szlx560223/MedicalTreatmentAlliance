$('#six *').click(function() {
    $.sendConfirm({
      title: '请您对该医院进行评价',
      content: '<div id="addIpBox">' + '<div class="frm-item">' + '<div class="frm-label"><span class="requireIcon">*</span> 评价等级（1-5）:</div>' + '<input type="text" class="frm-input" name="ip" placeholder="请填写1-5的数字">' + '<div class="msg-box j_msgIp hide"></div>' + '</div>' + '<div class="frm-item">' + '<div class="frm-label"><span class="requireIcon">*</span> 给该医院提出意见:</div>' + '<input type="text" class="frm-input" name="desc" placeholder="最多25个汉字">' + '<div class="msg-box j_msgDesc hide"></div>' + '</div>' + '<div class="frm-item">' + '<div class="frm-label"><span class="requireIcon">*</span> 给本此就诊评价:</div>' + '<input type="text" class="frm-input" name="operator" placeholder="最多30个汉字">' + '<div class="msg-box j_msgOperator hide"></div>' + '</div>' + '</div>',
      button: {
        confirm: '确认',
        cancel: '取消'
      },
      width: 260,
      onBeforeConfirm: function() {
        // onBeforeConfirm返回false，将阻止onConfirm的执行
        $.sendMsg('评价成功，感谢您的建议', 3000, function() {
      console.log('sendMsg closed');
   
  });
        return false;
      },
      onConfirm: function() {
          $.sendMsg('评价成功，感谢您的建议', 3000, function() {
      console.log('sendMsg closed');
   
  });
      },
      onCancel: function() {
          $.sendMsg('抱歉，这次评价不成功哦。', 3000, function() {
      console.log('sendMsg closed');
   
  });
      },
      onClose: function() {
          $.sendMsg('抱歉，这次评价不成功哦。', 3000, function() {
      console.log('sendMsg closed');
   
  });
      }
    });
  });
  $('#order1').click(function() {
    window.location.href = 'https://www.dg-tcm.com/h_zhongyiyuan/yygh/202110/31ec71c5ab244243b3d4ea0dabb81a91.shtml';
});

  $('#order2').click(function() {
      window.location.href = 'https://www.dg-tcm.com/h_zhongyiyuan/yygh/202110/31ec71c5ab244243b3d4ea0dabb81a91.shtml';
  });
  $('#order3').click(function() {
    window.location.href = 'https://www.dg-tcm.com/h_zhongyiyuan/yygh/202110/31ec71c5ab244243b3d4ea0dabb81a91.shtml';
});

  $('#order4').click(function() {
      window.location.href = 'https://www.dg-tcm.com/h_zhongyiyuan/yygh/202110/31ec71c5ab244243b3d4ea0dabb81a91.shtml';
  });
  $('#order5').click(function() {
    window.location.href = 'https://www.dg-tcm.com/h_zhongyiyuan/yygh/202110/31ec71c5ab244243b3d4ea0dabb81a91.shtml';
});

  $('#order6').click(function() {
      window.location.href = 'https://www.dg-tcm.com/h_zhongyiyuan/yygh/202110/31ec71c5ab244243b3d4ea0dabb81a91.shtml';
  });
  $('#order7').click(function() {
    window.location.href = 'https://www.dg-tcm.com/h_zhongyiyuan/yygh/202110/31ec71c5ab244243b3d4ea0dabb81a91.shtml';
});

  $('#order8').click(function() {
      window.location.href = 'https://www.dg-tcm.com/h_zhongyiyuan/yygh/202110/31ec71c5ab244243b3d4ea0dabb81a91.shtml';
  });
  $('#order9').click(function() {
    window.location.href = 'https://www.dg-tcm.com/h_zhongyiyuan/yygh/202110/31ec71c5ab244243b3d4ea0dabb81a91.shtml';
});

  $('#order10').click(function() {
      window.location.href = 'https://www.dg-tcm.com/h_zhongyiyuan/yygh/202110/31ec71c5ab244243b3d4ea0dabb81a91.shtml';
  });
