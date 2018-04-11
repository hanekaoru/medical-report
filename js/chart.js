(function () {
  // 声明两个svg变量
  var svg1, svg2;
  // 声明体育项目数组和项目数量变量
  var subjects, subjectCount;
  // 两个SVG的宽高
  var width1, height,
    width2, height2;
  // 玫瑰图任一方向上留白最小占据的百分比
  var minMarginPercentage;
  // 计算饼图的最大半径
  var maxRadius;

  // json数据
  var data;

  // 图表的完成状态，true表示已完成
var finished = true;

  // 页面的宽高
  var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

  // 体育各方面文本映射
  var sportAspectMap = {
    "strength": "力量",
    "speed": "速度",
    "stamina": "耐力",
    "flexibility": "柔韧",
    "agility": "灵敏"
  };

  // 体育各项目文本映射
  var sportSubjectMap = {
    "BMI": "身高体重比",
    "VC": "肺活量",
    "SAR": "坐位体前屈",
    "SKIPPING": "跳绳",
    "50": "50米跑",
    "SITUP": "仰卧起坐",
    "50*8": "50米*8跑",
    "LONGJUMP": "立定跳远",
    "PULLUP": "引体向上",
    "800&1000": "800或1000米跑"
  };

  // 年级与运动项目映射
  var getSubjectsOfGrade = function (grade, gender) {
    switch (grade) {
      case 1:
      case 2:
        return ["BMI", "VC", "SAR", "SKIPPING", "50"];
      case 3:
      case 4:
        return ["BMI", "VC", "SAR", "SKIPPING", "SITUP", "50"];
      case 5:
      case 6:
        return ["BMI", "VC", "SAR", "SKIPPING", "SITUP", "50", "50*8"];
      // case 7:
      // case 8:
      // case 9:
      default:
        if (gender === 1) { //中学男生
          return ["BMI", "VC", "SAR", "50", "LONGJUMP", "PULLUP", "800&1000"];
        } else { // 中学女生
          return ["BMI", "VC", "SAR", "50", "LONGJUMP", "SITUP", "800&1000"];
        }
    }
  };

  // 优良文本与百分比值映射
  var getPercentageWithDescription = function (des) {
    switch (des) {
      case "优秀":
      case "肥胖":
        return 1;
      case "良好":
      case "超重":
        return 0.75;
      case "及格":
      case "正常":
        return 0.5;
      case "不及格":
      case "低体重":
        return 0.25;
      default:
        return 0;
    }
  }

  // 按设计图顺序排序后的体育各方面能力
  var orderedAspects = ["stamina", "strength", "flexibility", "speed", "agility"];
  var count = 5; // orderedAspects 的长度

  // 每个区域的颜色映射
  var colors = {
    "stamina": ["#feeab7", "#fddf94", "#fdd570", "#fcca4c", "#f4bb47"],
    "strength": ["#fed6d3", "#fdc1bc", "#fdada6", "#fc9890", "#f98b85"],
    "flexibility": ["#bfeef9", "#9ee5f5", "#7eddf2", "#5ed4ef", "#59c8ea"],
    "speed": ["#e2f7bb", "#d4f298", "#c5ee76", "#b7ea54", "#b5e04b"],
    "agility": ["#c5f7ef", "#a8f2e8", "#8beee0", "#6eead8", "#65e0cb"]
  };

  // 等级映射到具体的扇形填充层数的值
  var levelToActiveCount = {
    "E": 1,
    "D": 2,
    "C": 3,
    "B": 4,
    "A": 5
  };

  // 绘制饼图
  function drawArcChart() {
    // 创建svg
    var arcDiv = d3.select("#arc-chart");
    svg1 = arcDiv.append("svg")
      .attr("width", width1)
      .attr("height", height1);
    var g = svg1.append("g")
      .attr("transform", "translate(" + [width1 / 2, height1 / 2] + ")");

    //绘制各部分扇形
    g.selectAll("g")
      .data(orderedAspects)
      .enter()
      .append("g")
      .each(function (d, i) {
        var cfg = new Config(i, d, data[d]);
        SectorComponent(d3.select(this), cfg);
      });


    // 创建多层扇形组件的配置项方法
    function Config(index, key, level) {
      return {
        startAngle: 360 / count * index,
        angle: 360 / count,
        outerRadius: maxRadius,
        innerRadius: 0,
        colors: colors[key],
        unfilledColor: "#eee",
        activeCount: 0//levelToActiveCount[level]
      };
    }
  }


  // 获取标注的相关信息
  function generateAnnotationData() {
    var annotations = [];

    var radius = maxRadius / count;
    var r = 0;

    orderedAspects.forEach(function (key, i) {
      var activeCount = levelToActiveCount[data[key]];
      r = radius * (activeCount - 0.5);
      annotations.push(generatePathData(i, key));
    });


    function generatePathData(i, key) {
      var output = {};

      var fontSize = 14;
      var angles = [45, 90, 180, 235, 310];
      var angle = angles[i] / 180 * Math.PI;

      var s = Math.sin,
        c = Math.cos;

      var x0, y0, x1, y1, x2, y2;

      switch (i) {
        case 0:
          x0 = r * s(angle);
          y0 = -r * c(angle);
          x2 = x0;
          y2 = -(maxRadius + 20); //

          output = {
            index: i,
            level: data[key],
            path: [[x0, y0], [x2, y2]],
            textAnchor: "start",
            text: "耐力",
            dx: 5,
            dy: 0
          };
          break;
        case 1:
          x0 = r;
          y0 = 0;
          x1 = maxRadius - 5;
          y1 = y0;
          x2 = x1;
          y2 = y1 + maxRadius; //

          output = {
            index: i,
            level: data[key],
            path: [[x0, y0], [x1, y1], [x2, y2]],
            textAnchor: "start",
            text: "力量",
            dx: 5,
            dy: - 2.2 * fontSize
          };
          break;
        case 2:
          x0 = 0;
          y0 = r;
          x2 = x0;
          y2 = maxRadius + 20; //

          output = {
            index: i,
            level: data[key],
            path: [[x0, y0], [x2, y2]],
            textAnchor: "start",
            text: "柔韧",
            dx: 5,
            dy: - 2.2 * fontSize
          };
          break;
        case 3:
          x0 = -r * s(angle - Math.PI);
          y0 = r * c(angle - Math.PI);
          x1 = -(maxRadius - 5);
          y1 = y0;
          x2 = x1;
          y2 = y1 + maxRadius * 0.7; //

          output = {
            index: i,
            level: data[key],
            path: [[x0, y0], [x1, y1], [x2, y2]],
            textAnchor: "end",
            text: "速度",
            dx: -5,
            dy: - 2.2 * fontSize
          };
          break;
        case 4:
          x0 = -r * s(Math.PI * 2 - angle);
          y0 = -r * c(Math.PI * 2 - angle);
          x2 = x0;
          y2 = -(maxRadius + 20); //

          output = {
            index: i,
            level: data[key],
            path: [[x0, y0], [x2, y2]],
            textAnchor: "end",
            text: "灵敏",
            dx: -5,
            dy: 0
          };
          break;
      };
      output.fontSize = fontSize;
      return output;
    }

    return annotations;
  }

  // 绘制标注
  function drawAnnotations() {
    var annotations = generateAnnotationData(data);

    var path = d3.line();

    var gs = svg1.select("g")
      .append("g").attr("class", "annotation-groups")
      .attr("opacity", 0) // 初始化时不显示
      .selectAll("g")
      .data(annotations)
      .enter()
      .append("g");

    gs.append("path")
      .attr("d", function (d) { return path(d.path) })
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("stroke-dasharray", "4 2");

    gs.append("circle")
      .attr("cx", function (d) {
        return d.path[0][0];
      })
      .attr("cy", function (d) {
        return d.path[0][1];
      })
      .attr("r", 2)
      .attr("fill", "gray");

    var text = gs.append("text")
      .attr("text-anchor", function (d) {
        return d.textAnchor;
      })
      .attr("font-size", function (d) {
        return d.fontSize;
      });

    text.append("tspan")
      .text(function (d) {
        return d.text;
      });

    text.append("tspan")
      .text(function (d) {
        return d.level;
      })
      .attr("dy", "1em")
      .attr("font-size", "1.2em")
      .attr("font-weight", "bold");

    text.selectAll("tspan")
      .attr("alignment-baseline", "hanging")
      .attr("x", function (d) {
        var p = d.path;
        return p[p.length - 1][0];
      })
      .attr("y", function (d) {
        var p = d.path;
        return p[p.length - 1][1] + d.dy;
      })
      .attr("dx", function (d) {
        return d.dx;
      });
  }


  // 绘制条形图
  function drawBarChart() {
    var margin = {
      top: 0.05,
      right: 0.15,
      bottom: 0.15,
      left: 0.15
    };

    var width = (1 - margin.left - margin.right) * width2,
      height = (1 - margin.top - margin.bottom) * height2;

    //每个项目占的整体高度
    var itemH = height / subjectCount;

    // 字体大小
    var fontSize = 14;

    svg2 = d3.select("#bar-chart").append("svg")
      .attr("width", width2)
      .attr("height", height2);

    var g = svg2.append("g")
      .attr("transform", "translate(" + [width2 * margin.left, height2 * margin.top] + ")")
      .attr("font-size", fontSize + "px");

    //背景矩形
    var rectPaddingHor = 20,
      rectPaddingVer = 12;
    g.append("rect")
      .attr("x", -rectPaddingHor)
      .attr("y", -rectPaddingVer)
      .attr("width", width + rectPaddingHor * 2)
      .attr("height", height + rectPaddingVer * 2)
      .attr("fill", "#ededed");

    g.selectAll("g")
      .data(subjects)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .attr("transform", function (d, i) {
        return "translate(" + [0, itemH * i] + ")"
      })
      .call(BarComponennt);


    function BarComponennt(selection) {
      var rectW = width * 0.82,
        rectH = itemH * 0.3;

      var rectRx = rectH / 2,
        rectY = fontSize * 1.5;


      selection.append("text")
        .text(function (d) {
          if (d == "800&1000") {
            return data.gender == 1 ? "1000米跑" : "800米跑";
          }
          return sportSubjectMap[d];
        })
        .attr("dy", fontSize * 1.1);

      selection.append("rect")
        .attr("class", "rect-bg")
        .attr("y", rectY)
        .attr("rx", rectRx)
        .attr("ry", rectRx)
        .attr("width", rectW)
        .attr("height", rectH)
        .attr("fill", "#fff");

      selection.append("rect")
        .attr("class", "rect-front")
        .attr("y", rectY)
        .attr("rx", rectRx)
        .attr("ry", rectRx)
        .attr("width", 0) // 初始化为0
        // .attr("width", function (d) {
        //   return getPercentageWithDescription(data[d]) * rectW;
        // })
        .attr("height", rectH)
        .attr("fill", "#7eddf2")
        // 将百分比值和宽度存入属性中，方便提取
        .property("fill-percentage", function (d) {
          return getPercentageWithDescription(data[d]);
        })
        .property("fill-width", function (d) {
          return getPercentageWithDescription(data[d]) * rectW;
        });

      selection.append("text")
        .attr("class", "sport-description")
        .text(function (d) {
          return data[d] || "未测";
        })
        .attr("dy", fontSize - 1)
        .attr("x", rectW + 8)
        .attr("y", rectY)
        .attr("opacity", 0);
    }
  }


  // 多层扇形组件
  function SectorComponent(selection, config) {
    var cfg = config;

    var count = cfg.colors.length;

    var innerRadius = cfg.innerRadius;
    var radius = (cfg.outerRadius - innerRadius) / count;

    var arc = d3.arc()
      .startAngle(radian(cfg.startAngle))
      .endAngle(radian(cfg.startAngle + cfg.angle));

    selection.classed("sectorGroup", true)
      .selectAll("path")
      .data(cfg.colors)
      .enter()
      .append("path")
      .each(sector);

    function radian(deg) {
      return Math.PI / 180 * deg;
    }

    function sector(d, i) {
      arc
        .innerRadius(innerRadius + radius * i)
        .outerRadius(innerRadius + radius * (i + 1));

      d3.select(this).attr("d", arc)
        .attr("stroke", "#fff")
        .attr("stroke-width", cfg.padding)
        .attr("fill", cfg.unfilledColor)
        .attr("fill-opacity", 1);
    }
  }

  function initVariables() {
    width1 = width2 = WIDTH,
      height1 = HEIGHT * 0.6,
      height2 = HEIGHT - height1;

    minMarginPercentage = 0.15;


    // 根据科目的数目不同，调整玫瑰图和柱图的高度
    subjects = getSubjectsOfGrade(data.grade, data.gender);
    subjectCount = subjects.length;

    if (subjectCount === 6) {
      height1 = HEIGHT * 0.55;
      height2 = HEIGHT - height1;
    } else if (subjectCount === 7) {
      height1 = HEIGHT * 0.5;
      height2 = HEIGHT - height1;
    };

    maxRadius = Math.min(width1, height1) * (1 - minMarginPercentage * 2) / 2;
  }


  // 玫瑰图颜色填充动画
  function arcFillAnimation(callback) {
    var activeCount = 0;
    var n = 0;

    svg1.selectAll(".sectorGroup").each(function (name) {
      activeCount = levelToActiveCount[data[name]];
      n += activeCount;

      d3.select(this).selectAll("path")
        .filter(function (d, i) {
          return i < activeCount;
        })
        .transition()
        .duration(400)
        .delay(function (d, i) {
          return i * 100;
        })
        .ease(d3.easeLinear)
        .attr("fill", function (d) {
          return d;
        })
        .on("end", function () {
          // 所有过渡动画完成后调用回调函数
          if (--n <= 0) {
            if (callback) {
              callback()
            };
          }
        })
    })
  }

  // 柱图填充动画
  function barFillAnimation() {
    svg2.selectAll("g.bar-group")
      .select("rect.rect-front")
      .transition()
      .duration(function (d) {
        return this["fill-percentage"] * 1000;
      })
      .ease(d3.easeLinear)
      .attr("width", function () {
        return this["fill-width"];
      })
      .on("end", function () {
        d3.select(this.parentNode).select("text.sport-description")
          .attr("opacity", 1)
      })
  }

  // 处理数据格式
  function formatData() {
    for (var key in data) {
      //生成一个将键名大写的副本，并且将是字符串类型的值进行trim()处理，以防有空格，便于能一一对应
      var upperKey = key.trim().toUpperCase();
      var value = data[key];
      var trimmedValue = typeof value == "string" ? value.trim() : value;
      data[upperKey] = trimmedValue;
    }
  }

  // 初始化
  function initialize(json) {
    data = json;
    initChart();
  }

  //初始化图表
  function initChart() {
    formatData();
    initVariables();

    drawArcChart();
    drawAnnotations();
    drawBarChart();

    restoreInitializedState();
  };

  // 恢复未上色状态
  function restoreInitializedState() {
    if(!finished){
      return;
    }

    // 先打断所有过渡动画
    svg1.selectAll("*").interrupt();
    svg2.selectAll("*").interrupt();

    // 隐藏svg
    svg1.style("visibility", "hidden");
    svg2.style("visibility", "hidden");

    // 将相关颜色等恢复成初始化状态
    svg1.select(".annotation-groups")
      .attr("opacity", 0);
    svg1.selectAll(".sectorGroup>path")
      .attr("fill", "#eee");
    svg2.selectAll(".rect-front")
      .attr("width", 0);

    finished = false;
  }

  // 过渡到上色状态
  function animateToFinish() {
    if(finished) {
      return;
    }

    svg1.style("visibility", "visible");

    arcFillAnimation(orderOfDrawing);

    finished = true;

    function orderOfDrawing() {
      svg1.select(".annotation-groups")
        .transition()
        .duration(50)
        // .delay(100)
        .attr("opacity", 1)
        .on("end", function () {
          setTimeout(function () {
            svg2.style("visibility", "visible");
            barFillAnimation();
          }, 300);
        });
    }
  }

  // 在window下挂在一个Chart对象，向外部暴露部分方法
  window.Chart = {
    initialize: initialize,
    restoreInitializedState: restoreInitializedState,
    animateToFinish: animateToFinish
  };
}());
