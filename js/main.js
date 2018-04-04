; (function (designWidth, maxWidth) {
  var doc = document,
    win = window,
    docEl = doc.documentElement,
    remStyle = document.createElement("style"),
    tid;

  function refreshRem() {
    var width = docEl.getBoundingClientRect().width;
    maxWidth = maxWidth || 540;
    width > maxWidth && (width = maxWidth);
    var rem = width * 100 / designWidth;
    remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
  }

  if (docEl.firstElementChild) {
    docEl.firstElementChild.appendChild(remStyle);
  } else {
    var wrap = doc.createElement("div");
    wrap.appendChild(remStyle);
    doc.write(wrap.innerHTML);
    wrap = null;
  }
  refreshRem();

  win.addEventListener("resize", function () {
    clearTimeout(tid);
    tid = setTimeout(refreshRem, 300);
  }, false);

  win.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      clearTimeout(tid);
      tid = setTimeout(refreshRem, 300);
    }
  }, false);

  if (doc.readyState === "complete") {
    doc.body.style.fontSize = "16px";
  } else {
    doc.addEventListener("DOMContentLoaded", function (e) {
      doc.body.style.fontSize = "16px";
    }, false);
  }
})(750, 750);

$(function () {
  $.ajax({
    url: "../data.json",
    success: (data) => {
      
      // 性别
      if (data.gender === 2) {
        $('#user-img').attr('src', './images/nv.png')
        $('#avatar').attr('src', './images/user-nv.png')
      } else {
        $('#user-img').attr('src', './images/nan.png')
        $('#avatar').attr('src', './images/user-nan.png')
      }

      // 姓名
      $('#user-name').html(data.name)

      // 学校
      $('#school').html(data.school)
      $('#grade').width(`${$('#school').width()}px`)

      // 班级
      if (data.grade < 7) {
        const id = changeClass(data.grade);
        $('#grade').html(`${id}年级（${data.class}）班`)
      } else if (data.grade > 7 && data.grade < 11) {
        $('#grade').html(`初${id}（${data.class}）班`)
      } else if (data.grade > 10) {
        $('#grade').html(`高${id}（${data.class}）班`)
      }

      // 视力
      $('#eyeleft').html(data.eyeleft)
      $('#eyeright').html(data.eyeright)

      // 牙齿
      $('#tooth').html(data.TOOTH)

      // 心率
      $('#heart-one').html(data.BPL)
      $('#heart-two').html(data.HR)
      $('#heart-three').html(data.BPH)
    }
  })
})

var changeClass = function(n) {
  const arr = ['一', '二', '三', '四', '五', '六'];
  if (isNaN(n) && n <= 1 && n >= 6) {
    return;
  }
  return arr[n - 1];
};
