jQuery(function()
{
  Typing.init();
});

var Typing =
{
  init : function()
  {
    Typing.readyPage = jQuery("#readyPage");
    Typing.stagePage = jQuery("#stagePage");
    Typing.closePage = jQuery("#closePage");
    Typing.questionArea = jQuery("#question");
    Typing.commentArea = jQuery("#comment");
    Typing.nameArea = jQuery("#name");
    Typing.inputArea = jQuery("#input");
    Typing.guideArea = jQuery("#guide");
    Typing.keybords = jQuery("#keybord .key");
    Typing.timerArea = jQuery(".timer");
    Typing.rightArea = jQuery(".right");
    Typing.wrongArea = jQuery(".wrong");
    Typing.retryButton = jQuery(".retry");
    Typing.rightPoint = 1;
    Typing.wrongPoint = 3;
    Typing.startKey = "F";
    Typing.randomImageCount = {
      akasan:023,
      aritaku:009,
      antony:013,
      orin:001,
      kunimu:020,
      zakio:006,
      saku:013,
      bassy:017,
      ha1f:018,
      manafy:001,
      yokun:029,
      yoshi:010,
      rinrin:002,
    }
    Typing.clearPoints = 300;

    Typing.ready();
  }
};

Typing.ready = function()
{
  Typing.second = 60;
  Typing.rightCount = 0;
  Typing.wrongCount = 0;
  Typing.datasIndex = [];

  for(var i = 0; i < Typing.datas.length; i++) Typing.datasIndex[i] = i;

  Typing.stagePage.hide();
  Typing.closePage.hide();
  Typing.right();
  Typing.wrong();

  Typing.readyPage.fadeIn();
  Typing.activeKeybord(Typing.startKey);
  Typing.setTypingHandler(Typing.readyHandler);
};

Typing.readyHandler = function(e)
{
  if(Typing.codeToChar(e.keyCode, e.shiftKey) === Typing.startKey)
  {
    Typing.readyPage.hide();
    Typing.stagePage.show();
    Typing.timer();
    Typing.chooseQuestion();
  }
};

Typing.timer = function()
{
  Typing.timerHandler();
  Typing.timerID = setInterval(Typing.timerHandler, 1000);
};

Typing.timerHandler = function()
{
  if(Typing.second === 0)
  {
    clearInterval(Typing.timerID);
    Typing.close();
  }
  var m = Math.floor(Typing.second / 60);
  var s = Typing.second % 60;
  if(m < 10) m = "0" + m;
  if(s < 10) s = "0" + s;

  Typing.timerArea.text(m + ":" + s);
  Typing.second--;
};

Typing.chooseQuestion = function()
{
  var i = Math.floor(Math.random() * Typing.datasIndex.length);

  Typing.data = Typing.datas[Typing.datasIndex[i]];

  if(Typing.datasIndex.length > 5)
  {
    Typing.datasIndex.splice(i, 1);
  }
  Typing.input = "";
  Typing.characters = Typing.kanaToChar(Typing.data.kana);

  Typing.displayQuestion();
  Typing.dsiplayComment();
  Typing.dsiplayname(Typing.data.name);
  Typing.displayCharacters();
  Typing.activeKeybord();
  Typing.setTypingHandler(Typing.typing);
};

Typing.typing = function(e)
{
  var chr = Typing.codeToChar(e.keyCode, e.shiftKey);

  if(chr)
  {
    var judge = Typing.judge(chr);

    if(judge !== false)
    {
      if(judge)
      {
        Typing.displayCharacters();
        Typing.activeKeybord();
      }
      else
      {
        Typing.chooseQuestion();
      }
      Typing.playTypingSound();
      Typing.rightCount++;
      Typing.right();
    }
    else
    {
      Typing.playWrongSound();
      Typing.wrongCount++;
      Typing.wrong();
    }
  }
};

Typing.playTypingSound = function () {
  var typeSound = new Audio("audio/typing.mp3");
  typeSound.play();
};

Typing.playWrongSound = function () {
  var typeSound = new Audio("audio/wrong.mp3");
  typeSound.play();
};

Typing.playEndSound = function (callback) {
  var endSound = new Audio("audio/end.mp3");
  endSound.onended = callback;
  endSound.play();
};

Typing.judge = function(chr)
{
  for(var i = 0; i < Typing.characters[0].length; i++)
  {
    if(Typing.characters[0][i].substr(0, 1) == chr)
    {
      Typing.input += chr;

      for(var i = 0; i < Typing.characters[0].length; i++)
      {
        if(Typing.characters[0][i].substr(0, 1) == chr)
        {
          Typing.characters[0][i] = Typing.characters[0][i].substr(1);

          if(Typing.characters[0][i].length === 0)
          {
            Typing.characters.shift();
            break;
          }
        }
        else
        {
          Typing.characters[0].splice(i, 1);
          i--;
        }
      }
      return Typing.characters.length;
    }
  }
  return false;
};

Typing.close = function()
{
  Typing.setBodyCss();
  Typing.setTypingHandler();
  Typing.activeKeybord(false);
  //以下いじった
  Typing.playEndSound()
  // Typing.playEndSound(function () {
    Typing.closePage.fadeIn(100);
    Typing.closePage.find(".right").hide().delay(500).fadeIn(500);
    Typing.closePage.find(".wrong").hide()
                                   .delay(1500)
                                   .fadeIn(500);
    Typing.closePage.find(".retry").hide()
                                   .delay(2500)
                                   .fadeIn(500)
                                   .unbind("retry")
                                   .click(Typing.ready);
    Typing.closePage.find(".level").hide()
                                   .delay(2500)
                                   .fadeIn(500)
                                   .find("span").text(Typing.mark());

    window.setTimeout(function () {
      Typing.forwardToMessage();
    }, 5500);
  // });
  // alert(Typing.mark());
};

Typing.forwardToMessage = function () {
  var points = Typing.getPoints();

  if (points >= Typing.clearPoints) {
    location.href = "message/index.html";
  }
};

Typing.right = function()
{
  Typing.rightArea.html("<span class=\"correct\">○<\/span>" + Typing.rightCount);
};

Typing.wrong = function()
{
  Typing.wrongArea.html("<span class=\"error\">☓<\/span>" + Typing.wrongCount);
};

Typing.getPoints = function () {
  var rightPoint = Typing.rightCount * Typing.rightPoint;
  var wrongPoint = Typing.wrongCount * Typing.wrongPoint;
  return rightPoint - wrongPoint;
};

Typing.setBodyCss = function () {
  var points = Typing.getPoints();
  var body = $('body');
  var cssValue = 'congratulation';

  if (body.length) {
    if (points >= Typing.clearPoints) {
      body.addClass(cssValue);
    } else {
      body.removeClass(cssValue);
    }
  }
};

Typing.mark = function()
{
  var level = "E";
  var point = Typing.getPoints();

  if      (point <  25) level = "E";
  else if (point <  50) level = "E+";
  else if (point <  75) level = "D-";
  else if (point < 100) level = "D";
  else if (point < 125) level = "D+";
  else if (point < 150) level = "C-";
  else if (point < 175) level = "C";
  else if (point < 200) level = "C+";
  else if (point < 225) level = "B-";
  else if (point < 250) level = "B";
  else if (point < 275) level = "B+";
  else if (point < 300) level = "A-";
  else if (point < 325) level = "A";
  else if (point < 350) level = "A+";
  else level = "S";
  return level;
};

Typing.kanaToChar = function(str)
{
  var characters = [];

  for(var i = 0; i < str.length; i++)
  {
    var list = [];
    var s1 = str.substr(i, 1);
    var s2 = str.substr(i + 1, 1);
    var s3 = str.substr(i + 2, 1);
    var s4 = str.substr(i + 3, 1);
    var c1 = s1 ? Typing.charTable[s1] : "";
    var c2 = s2 ? Typing.charTable[s2] : "";
    var c3 = s3 ? Typing.charTable[s3] : "";
    var c4 = s4 ? Typing.charTable[s4] : "";
    var cA = s1 && s2 ? Typing.charTable[s1 + s2] : "";
    var cB = s2 && s3 ? Typing.charTable[s2 + s3] : "";
    var cC = s3 && s4 ? Typing.charTable[s3 + s4] : "";

    if(cA)
    {
      for(var iA in cA) list.push(cA[iA]);
      for(var i1 in c1) for(var i2 in c2) list.push(c1[i1] + c2[i2]);

      i = i + 1;
    }
    else if(s1 == "ン")
    {
      if(s2 == "ッ")
      {
        if(!c3 || c3[0].match(/^(A|I|U|E|O|N)/) || c3[0].length == 1)
        {
          list.push("NNXTU");
          list.push("NNLTU");
          list.push("NNXTSU");
          list.push("NNLTSU");
          list.push("NXTU");
          list.push("NLTU");
          list.push("NXTSU");
          list.push("NLTSU");

          i = i + 1;
        }
        else　if(cC)
        {
          for(var iC in cC)
          {
            list.push("NN"     + cC[iC].substr(0, 1) + cC[iC]);
            list.push("NNXTU"  + cC[iC]);
            list.push("NNLTU"  + cC[iC]);
            list.push("NNXTSU" + cC[iC]);
            list.push("NNLTSU" + cC[iC]);
            list.push("N"      + cC[iC].substr(0, 1) + cC[iC]);
            list.push("NXTU"   + cC[iC]);
            list.push("NLTU"   + cC[iC]);
            list.push("NXTSU"  + cC[iC]);
            list.push("NLTSU"  + cC[iC]);
          }
          for(var i3 in c3) for(var i4 in c4)
          {
            list.push("NN"     + c3[i3].substr(0, 1) + c3[i3] + c4[i4]);
            list.push("NNXTU"  + c3[i3] + c4[i4]);
            list.push("NNLTU"  + c3[i3] + c4[i4]);
            list.push("NNXTSU" + c3[i3] + c4[i4]);
            list.push("NNLTSU" + c3[i3] + c4[i4]);
            list.push("N"      + c3[i3].substr(0, 1) + c3[i3] + c4[i4]);
            list.push("NXTU"   + c3[i3] + c4[i4]);
            list.push("NLTU"   + c3[i3] + c4[i4]);
            list.push("NXTSU"  + c3[i3] + c4[i4]);
            list.push("NLTSU"  + c3[i3] + c4[i4]);
          }
          i = i + 3;
        }
        else
        {
          for(var i3 in c3)
          {
            list.push("NN"     + c3[i3].substr(0, 1) + c3[i3]);
            list.push("NNXTU"  + c3[i3]);
            list.push("NNLTU"  + c3[i3]);
            list.push("NNXTSU" + c3[i3]);
            list.push("NNLTSU" + c3[i3]);
            list.push("N"      + c3[i3].substr(0, 1) + c3[i3]);
            list.push("NXTU"   + c3[i3]);
            list.push("NLTU"   + c3[i3]);
            list.push("NXTSU"  + c3[i3]);
            list.push("NLTSU"  + c3[i3]);
          }
          i = i + 2;
        }
      }
      else if(!c2 || c2[0].match(/^(A|I|U|E|O|N)/))
      {
        list.push("NN");
      }
      else if(cB)
      {
        for(var iB in cB)
        {
          list.push("NN" + cB[iB]);
          list.push("N" + cB[iB]);
        }
        for(var i2 in c2) for(var i3 in c3)
        {
          list.push("NN" + c2[i2] + c3[i3]);
          list.push("N" + c2[i2] + c3[i3]);
        }
        i = i + 2;
      }
      else
      {
        for(var i2 in c2)
        {
          list.push("NN" + c2[i2]);
          list.push("N" + c2[i2]);
        }
        i = i + 1;
      }
    }
    else if(s1 == "ッ")
    {
      if(!c2 || c2[0].match(/^(A|I|U|E|O|N)/) || c2[0].length == 1)
      {
        list.push("XTU");
        list.push("LTU");
        list.push("XTSU");
        list.push("LTSU");
      }
      else　if(cB)
      {
        for(var iB in cB)
        {
          list.push(cB[iB].substr(0, 1) + cB[iB]);
          list.push("XTU" + cB[iB]);
          list.push("LTU" + cB[iB]);
          list.push("XTSU" + cB[iB]);
          list.push("LTSU" + cB[iB]);
        }
        for(var i2 in c2) for(var i3 in c3)
        {
          list.push(c2[i2].substr(0, 1) + c2[i2] + c3[i3]);
          list.push("XTU" + c2[i2] + c3[i3]);
          list.push("LTU" + c2[i2] + c3[i3]);
          list.push("XTSU" + c2[i2] + c3[i3]);
          list.push("LTSU" + c2[i2] + c3[i3]);
        }
        i = i + 2;
      }
      else
      {
        for(var i2 in c2)
        {
          list.push(c2[i2].substr(0, 1) + c2[i2]);
          list.push("XTU" + c2[i2]);
          list.push("LTU" + c2[i2]);
          list.push("XTSU" + c2[i2]);
          list.push("LTSU" + c2[i2]);
        }
        i = i + 1;
      }
    }
    else
    {
      for(var i1 in c1) list.push(c1[i1]);
    }
    characters.push(list);
  }
  return characters;
}

Typing.codeToChar = function(keycode, shiftKey)
{
  if(Typing.codeTable[keycode])
  {
    return shiftKey ? Typing.codeTable[keycode][1] : Typing.codeTable[keycode][0];
  }
  return false;
}

Typing.charToCode = function(chr)
{
  for(var i in Typing.codeTable)
  {
    if(Typing.codeTable[i][0] == chr) return {code : i, shift : false};
    if(Typing.codeTable[i][1] == chr) return {code : i, shift : true};
  }
  return false;
}

Typing.setTypingHandler = function(eventHandler)
{
  jQuery(window).unbind("keydown");
  if(eventHandler) jQuery(window).bind("keydown", eventHandler);
}

Typing.displayQuestion = function()
{
  Typing.questionArea.text(Typing.data.question)
}

Typing.displayCharacters = function()
{
  var input = Typing.input;
  if(input.length > 5)
  input = input.substr(input.length - 5);

  var guide = input;
  for (var i in Typing.characters)
  guide += Typing.characters[i][0];

  Typing.inputArea.text(input);
  Typing.guideArea.text(guide);
}

Typing.dsiplayComment = function()
{
  Typing.commentArea.text(Typing.data.to + "　　From "+Typing.data.comment)
}

Typing.prefixWithZero = function (value) {
  var result = value % 1000;
  var resultStr = result.toString();

  if (value < 10) {
    return "00" + resultStr;
  } else if (value < 100) {
    return "0" + resultStr;
  } else {
    return resultStr;
  }
}

// Typing.pickRandomImage = function () {
//   var randomNumber = Math.floor((Math.random() * Typing.randomImageCount) + 1);
//   return "komori" + Typing.prefixWithZero(randomNumber) + ".jpg";
// };

Typing.pickRandomImage = function (value) {
  var randomNumber = Math.floor((Math.random() * Typing.randomImageCount[value]) + 1);
  return value + Typing.prefixWithZero(randomNumber) + ".jpg";
};


Typing.dsiplayname = function(value)
{
  var imageName = Typing.pickRandomImage(value);
  // alert(imageName);
  $('body').css({
    backgroundImage : 'url(images/' + imageName + ')'
      // background : "#000"
  })
}

Typing.activeKeybord = function(nextChar)
{
  Typing.keybords.removeClass("active");

  if(nextChar !== false)
  {
    if(!nextChar)
    nextChar = Typing.guideArea.text().substr(Typing.inputArea.text().length, 1);

    var nextCode = Typing.charToCode(nextChar);

    if(nextCode.shift)
    jQuery(".shift", Typing.keybordes).addClass("active");
    jQuery(".key" + nextCode.code, Typing.keybordes).addClass("active");
  }
}

Typing.codeTable = {
   32 : [ " " , " " ],
   48 : [ "0" , ""  ],
   49 : [ "1" , "!" ],
   50 : [ "2" , '"' ],
   51 : [ "3" , "#" ],
   52 : [ "4" , "$" ],
   53 : [ "5" , "%" ],
   54 : [ "6" , "&" ],
   55 : [ "7" , "'" ],
   56 : [ "8" , "(" ],
   57 : [ "9" , ")" ],
   59 : [ ":" , "+" ], // ブラウザ差異あり
   65 : [ "A" , "A" ],
   66 : [ "B" , "B" ],
   67 : [ "C" , "C" ],
   68 : [ "D" , "D" ],
   69 : [ "E" , "E" ],
   70 : [ "F" , "F" ],
   71 : [ "G" , "G" ],
   72 : [ "H" , "H" ],
   73 : [ "I" , "I" ],
   74 : [ "J" , "J" ],
   75 : [ "K" , "K" ],
   76 : [ "L" , "L" ],
   77 : [ "M" , "M" ],
   78 : [ "N" , "N" ],
   79 : [ "O" , "O" ],
   80 : [ "P" , "P" ],
   81 : [ "Q" , "Q" ],
   82 : [ "R" , "R" ],
   83 : [ "S" , "S" ],
   84 : [ "T" , "I" ],
   85 : [ "U" , "U" ],
   86 : [ "V" , "V" ],
   87 : [ "W" , "W" ],
   88 : [ "X" , "X" ],
   89 : [ "Y" , "Y" ],
   90 : [ "Z" , "Z" ],
  107 : [ ";" , "+" ], // ブラウザ差異あり
  109 : [ "-" , "=" ], // ブラウザ差異あり
  186 : [ ":" , "*" ], // ブラウザ差異あり
  187 : [ ";" , "+" ], // ブラウザ差異あり
  188 : [ "," , "<" ],
  189 : [ "-" , "=" ], // ブラウザ差異あり
  190 : [ "." , ">" ],
  191 : [ "/" , "?" ],
  192 : [ "@" , "`" ],
  219 : [ "[" , "{" ],
  220 : [ "\\", "|" ],
  221 : [ "]" , "}" ],
  222 : [ "^" , "~" ],
  226 : [ "\\", "_" ]
}
Typing.charTable = {
  "１"   : ["1"],
  "２"   : ["2"],
  "３"   : ["3"],
  "４"   : ["4"],
  "５"   : ["5"],
  "６"   : ["6"],
  "７"   : ["7"],
  "８"   : ["8"],
  "９"   : ["9"],
  "０"   : ["0"],
  "Ａ"   : ["A"],
  "Ｂ"   : ["B"],
  "Ｃ"   : ["C"],
  "Ｄ"   : ["D"],
  "Ｅ"   : ["E"],
  "Ｆ"   : ["F"],
  "Ｇ"   : ["G"],
  "Ｈ"   : ["H"],
  "Ｉ"   : ["I"],
  "Ｊ"   : ["J"],
  "Ｋ"   : ["K"],
  "Ｌ"   : ["L"],
  "Ｍ"   : ["M"],
  "Ｎ"   : ["N"],
  "Ｏ"   : ["O"],
  "Ｐ"   : ["P"],
  "Ｑ"   : ["Q"],
  "Ｒ"   : ["R"],
  "Ｓ"   : ["S"],
  "Ｔ"   : ["T"],
  "Ｕ"   : ["U"],
  "Ｖ"   : ["V"],
  "Ｗ"   : ["W"],
  "Ｘ"   : ["X"],
  "Ｙ"   : ["Y"],
  "Ｚ"   : ["Z"],
  "ア"   : ["A"],
  "イ"   : ["I"],
  "ウ"   : ["U", "WU"],
  "エ"   : ["E"],
  "オ"   : ["O"],
  "カ"   : ["KA", "CA"],
  "キ"   : ["KI"],
  "ク"   : ["KU", "CU", "QU"],
  "ケ"   : ["KE"],
  "コ"   : ["KO", "CO"],
  "サ"   : ["SA"],
  "シ"   : ["SI", "CI", "SHI"],
  "ス"   : ["SU"],
  "セ"   : ["SE", "CE"],
  "ソ"   : ["SO"],
  "タ"   : ["TA"],
  "チ"   : ["TI", "CHI"],
  "ツ"   : ["TU", "TSU"],
  "テ"   : ["TE"],
  "ト"   : ["TO"],
  "ナ"   : ["NA"],
  "ニ"   : ["NI"],
  "ヌ"   : ["NU"],
  "ネ"   : ["NE"],
  "ノ"   : ["NO"],
  "ハ"   : ["HA"],
  "ヒ"   : ["HI"],
  "フ"   : ["HU", "FU"],
  "ヘ"   : ["HE"],
  "ホ"   : ["HO"],
  "マ"   : ["MA"],
  "ミ"   : ["MI"],
  "ム"   : ["MU"],
  "メ"   : ["ME"],
  "モ"   : ["MO"],
  "ヤ"   : ["YA"],
  "ユ"   : ["YU"],
  "ヨ"   : ["YO"],
  "ラ"   : ["RA"],
  "リ"   : ["RI"],
  "ル"   : ["RU"],
  "レ"   : ["RE"],
  "ロ"   : ["RO"],
  "ワ"   : ["WA"],
  "ヲ"   : ["WO"],
//  "ン"   : ["NN"],
  "ガ"   : ["GA"],
  "ギ"   : ["GI"],
  "グ"   : ["GU"],
  "ゲ"   : ["GE"],
  "ゴ"   : ["GO"],
  "ザ"   : ["ZA"],
  "ジ"   : ["ZI", "JI"],
  "ズ"   : ["ZU"],
  "ゼ"   : ["ZE"],
  "ゾ"   : ["ZO"],
  "ダ"   : ["DA"],
  "ヂ"   : ["DI"],
  "ヅ"   : ["DU"],
  "デ"   : ["DE"],
  "ド"   : ["DO"],
  "バ"   : ["BA"],
  "ビ"   : ["BI"],
  "ブ"   : ["BU"],
  "ベ"   : ["BE"],
  "ボ"   : ["BO"],
  "パ"   : ["PA"],
  "ピ"   : ["PI"],
  "プ"   : ["PU"],
  "ペ"   : ["PE"],
  "ポ"   : ["PO"],
  "ァ"   : ["XA", "LA"],
  "ィ"   : ["XI", "XYI", "LI", "LYI"],
  "ゥ"   : ["XU", "LU"],
  "ェ"   : ["XE", "XYE", "LE", "LYE"],
  "ォ"   : ["XO", "LO"],
  "ャ"   : ["XYA", "LYA"],
  "ュ"   : ["XYU", "LYU"],
  "ョ"   : ["XYO", "LYO"],
  "ヶ"   : ["XKE", "LKE"],
//  "ッ"   : ["XTU", "LTU", "XTSU", "LTSU"],
  "ウィ"  : ["WI"],
  "ウェ"  : ["WE"],
  "キャ"  : ["KYA"],
  "キィ"  : ["KYI"],
  "キェ"  : ["KYE"],
  "キュ"  : ["KYU"],
  "キョ"  : ["KYO"],
  "クァ"  : ["QA", "KWA"],
  "クィ"  : ["QI", "QYI"],
  "クェ"  : ["QE"],
  "クォ"  : ["QO"],
  "クャ"  : ["QYA"],
  "クュ"  : ["QYU"],
  "クョ"  : ["QYO"],
  "シャ"  : ["SYA", "SHA"],
  "シィ"  : ["SYI"],
  "シュ"  : ["SYU", "SHU"],
  "シェ"  : ["SYE", "SHE"],
  "ショ"  : ["SYO", "SHO"],
  "チャ"  : ["TYA", "CHA", "CYA"],
  "チィ"  : ["TYI", "CYI"],
  "チュ"  : ["TYU", "CHU", "CYU"],
  "チェ"  : ["TYE", "CHE", "CYE"],
  "チョ"  : ["TYO", "CHO", "CYO"],
  "ツァ"  : ["TSA"],
  "ツィ"  : ["TSI"],
  "ツェ"  : ["TSE"],
  "ツォ"  : ["TSO"],
  "テャ"  : ["THA"],
  "ティ"  : ["THI"],
  "テュ"  : ["THU"],
  "テェ"  : ["THE"],
  "テョ"  : ["THO"],
  "トァ"  : ["TWA"],
  "トィ"  : ["TWI"],
  "トゥ"  : ["TWU"],
  "トェ"  : ["TWE"],
  "トォ"  : ["TWO"],
  "ニャ"  : ["NYA"],
  "ニィ"  : ["NYI"],
  "ニュ"  : ["NYU"],
  "ニェ"  : ["NYE"],
  "ニョ"  : ["NYO"],
  "ヒャ"  : ["HYA"],
  "ヒィ"  : ["HYI"],
  "ヒュ"  : ["HYU"],
  "ヒェ"  : ["HYE"],
  "ヒョ"  : ["HYO"],
  "ファ"  : ["FA"],
  "フィ"  : ["FI", "FYI"],
  "フェ"  : ["FE", "FYE"],
  "フォ"  : ["FO"],
  "フャ"  : ["FYA"],
  "フュ"  : ["FYU"],
  "フョ"  : ["FYO"],
  "ミャ"  : ["MYA"],
  "ミィ"  : ["MYI"],
  "ミュ"  : ["MYU"],
  "ミェ"  : ["MYE"],
  "ミョ"    : ["MYO"],
  "リャ"  : ["RYA"],
  "リィ"  : ["RYI"],
  "リュ"  : ["RYU"],
  "リェ"  : ["RYE"],
  "リョ"    : ["RYO"],
  "ギャ"  : ["GYA"],
  "ギィ"  : ["GYI"],
  "ギュ"  : ["GYU"],
  "ギェ"  : ["GYE"],
  "ギョ"  : ["GYO"],
  "ジャ"  : ["ZYA", "JA", "JYA"],
  "ジィ"  : ["ZYI", "JYI"],
  "ジュ"  : ["ZYU", "JU", "JYU"],
  "ジェ"  : ["ZYE", "JE", "JYE"],
  "ジョ"  : ["ZYO", "JO", "JYO"],
  "ヂャ"  : ["DYA"],
  "ヂィ"  : ["DYI"],
  "ヂュ"  : ["DYU"],
  "ヂェ"  : ["DYE"],
  "ヂョ"  : ["DYO"],
  "デャ"  : ["DHA"],
  "ディ"  : ["DHI"],
  "デュ"  : ["DHU"],
  "デェ"  : ["DHE"],
  "デョ"  : ["DHO"],
  "ドァ"  : ["DWA"],
  "ドィ"  : ["DWI"],
  "ドゥ"  : ["DWU"],
  "ドェ"  : ["DWE"],
  "ドォ"  : ["DWO"],
  "ビャ"  : ["BYA"],
  "ビィ"  : ["BYI"],
  "ビュ"  : ["BYU"],
  "ビェ"  : ["BYE"],
  "ビョ"  : ["BYO"],
  "ピャ"  : ["PYA"],
  "ピィ"  : ["PYI"],
  "ピュ"  : ["PYU"],
  "ピェ"  : ["PYE"],
  "ピョ"  : ["PYO"],
  "！"   : ["!"],
  "”"   : ["\""],
  "＃"   : ["#"],
  "％"   : ["%"],
  "＆"   : ["&"],
  "’"   : ["'"],
  "（"   : ["("],
  "）"   : [")"],
  "ー"   : ["-"],
  "＝"   : ["="],
  "＾"   : ["^"],
  "～"   : ["~"],
  "￥"   : ["\\"],
  "|"   : ["|"],
  "＠"   : ["@"],
  "‘"   : ["`"],
  "「"   : ["["],
  "｛"   : ["{"],
  "＋"   : ["+"],
  "＊"   : ["*"],
  "」"   : ["]"],
  "｝"   : ["}"],
  "、"   : [","],
  "＜"   : ["<"],
  "。"   : ["."],
  "＞"   : [">"],
  "・"   : ["/"],
  "？"   : ["?"],
  "￥"   : ["\\"],
  "＿"   : ["_"],
  "　"   : [" "],
  "m"   : ["M"],
  "a"   : ["A"],
  "V"   : ["V"],
  "R"   : ["R"],
  "i"   : ["I"],
  "W"   : ["W"],
  "w"   : ["W"],
  "U"   : ["U"],
  "X"   : ["X"],
  "L"   : ["L"],
  "I"   : ["I"],
  "N"   : ["N"],
  "E"   : ["E"],
  "J"   : ["J"],
  "S"   : ["S"],
}

Typing.datas = [
  // {
  //  name : "kyah",
  //  question : "タスクに潰されるこなつくん",
  //  kana : "タスクニツブサレルコナツクン",
  //  comment : "さこぽん"
  // },  {
  //  name : "kyah",
  //  question : "締切に追われるこなつくん",
  //  kana : "シメキリニオワレルレルコナツクン",
  //  comment : "さこぽん"
  // },
  // {
  //  name : "komori",
  //  question : "全てにおいて思考せよ",
  //  kana : "スベテニオイテシコウセヨ",
  //  comment : "小森勇太"
  // },
 {
to:"アカさん",
name:"akasan",
question:"ベイベー！",
kana:"ベイベー！",
comment:"みんな"
},
{
to:"アカさん",
name:"akasan",
question:"俺は絶対に群れない、一人で囲ってやる",
kana:"オレハゼッタイムレナイ、ヒトリデカコッテヤル",
comment:"Twitter"
},
{
to:"アカさん",
name:"akasan",
question:"ちっちさん尊い",
kana:"チッチサントウトイ",
comment:"Twitter"
},
{
to:"アカさん",
name:"akasan",
question:"ちっちさん可愛いなあ",
kana:"チッチサンカワイイナア",
comment:"Twitter"
},
{
to:"アカさん",
name:"akasan",
question:"ずっとチャック空いてた",
kana:"ズットチャックアイテタ",
comment:"Twitter"
},
{
to:"アカさん",
name:"akasan",
question:"希望がない",
kana:"キボウガナイ",
comment:"Twitter"
},
{
to:"アカさん",
name:"akasan",
question:"ぽきた",
kana:"ポキタ",
comment:"Twitter"
},
{
to:"アカさん",
name:"akasan",
question:"ゆーくんの女装、板についてきた",
kana:"ユークンノジョソウ、イタニツイテキタ",
comment:"Twitter"
},
{
to:"アカさん",
name:"akasan",
question:"うちのWiiがジョブズになった",
kana:"ウチノWiiガジョブズニナッタ",
comment:"Twitter"
},
{
to:"アカさん",
name:"akasan",
question:"VRと赤ちゃんプレイと語学学習でイッパツ当てたい",
kana:"VRトアカチャンプレイトゴガクガクシュウデイッパツアテタイ",
comment:"Twitter"
},
{
to:"アカさん",
name:"akasan",
question:"やべえww２時間くらい山手線乗ってたwww",
kana:"ヤベエwwニジカンクライヤマノテセンノッテタワwww",
comment:"Twitter"
},
{
to:"アカさん",
name:"akasan",
question:"死んじゃえって言われてる、興奮するわ",
kana:"シンジャエッテイワレテル、コウフンスルワ",
comment:"Twitter"
},
{
to:"アカさん",
name:"akasan",
question:"自分、もう一眠りいいっすか",
kana:"ジブン、モウヒトネムリイイッスカ",
comment:"Twitter"
},
{
to:"アカさん",
name:"akasan",
question:"シェリーさんに捧げる歌、練習しよ",
kana:"シェリーサンニササゲルウタ、レンシュウシヨ",
comment:"Twitter"
},　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
{
to:"アカさん",
name:"saku",
question:"卒研放棄して壁登りしたい",
kana:"ソツケンホウキシテカベノボリシタイ",
comment:"さこぽん"
},
{
to:"ありたく",
name:"aritaku",
question:"炎上したくないよおー",
kana:"エンジョウシタクナイヨオー",
comment:"Twitter"
},
{
to:"ありたく",
name:"aritaku",
question:"文学ってどういう点に価値が出てくるのか知りたい",
kana:"ブンガクッテドウイウテンニカチガデテクルノカシリタイ",
comment:"Twitter"
},
{
to:"ありたく",
name:"aritaku",
question:"俺も早く結婚したい",
kana:"オレモハヤクケッコンシタイ",
comment:"Twitter"
},
{
to:"ありたく",
name:"aritaku",
question:"技術的に出来ることも増えれば創作意欲もわく",
kana:"ギジュツテキニデキルコトモフエレバソウサウイヨクモワク",
comment:"Twitter"
},
{
to:"ありたく",
name:"aritaku",
question:"白背景のアイコンってスタイリッシュに見えるからいいね",
kana:"シロハイケイノアイコンッテスタイリッシュニミエルカライイネ",
comment:"Twitter"
},
{
to:"あんとにー",
name:"antony",
question:"そっすねぇ〜",
kana:"ソウッスネェー",
comment:"もんぼ"
},
{
to:"おりん",
name:"orin",
question:"お互い合格してたらいいね",
kana:"オタガイゴウカクシテタライイネ",
comment:"ゆっこちゃん"
},
{
to:"クニムー",
name:"kunimu",
question:"チビ",
kana:"チビ",
comment:"もんぼ"
},
{
to:"ざきお",
name:"zakio",
question:"んなもん適当にやっといたらええんよ",
kana:"ンナモンテキトウニヤットイタラエエンヨ",
comment:"きゃあ。"
},
{
to:"さくちゃん",
name:"saku",
question:"梅田で週5で飲んでるから",
kana:"ウメダデシュウゴデノンデルカラ",
comment:"けーちゃん"
},
{
to:"さくちゃん",
name:"saku",
question:"今度飲みいこ",
kana:"コンドノミイコ",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"インスタは可愛い子を見つけるツール",
kana:"インスタハカワイイコヲミツケルツール",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"miwaと結婚できるならしたい",
kana:"miwaトケッコンデキルナラシタイ",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"癒やしがほしい",
kana:"イヤシガホシイ",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"酒は最高",
kana:"サケハサイコウ",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"飲酒したい",
kana:"インシュシタイ",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"魔法少女になりてー",
kana:"マホウショウジョニナリテー",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"闇深い",
kana:"ヤミフカイ",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"どう考えても酒飲み足りない",
kana:"ドウカンガエテモサケノミタリナイ",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"はよ酒飲みたい",
kana:"ハヨサケノミタイ",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"UXってなんやねん！",
kana:"UXッテナンヤネン",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"治安悪化させていきたい",
kana:"チアンアッカサセテイキタイ",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"禁酒失敗してしまった",
kana:"キンシュシッパイシテシマッタ",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"オフィスをクラブにしたい",
kana:"オフィスヲクラブニシタイ",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"クソエモい恋愛したいな",
kana:"クソエモイレンアイシタイナ",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"欲望しか無い",
kana:"ヨクボウシカナイ",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"はるふサイコパスっぽいな",
kana:"ハルフサイコパスッポイナ",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"いったん全裸になる",
kana:"イッタンゼンラニナル",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"もう8時間も酒飲んでない",
kana:"モウハチジカンモサケノンデナイ",
comment:"Twitter"
},
{
to:"さくちゃん",
name:"saku",
question:"女なんて星の数ほどいるからなあ",
kana:"オンナナンテホシノカズホドイルカラナア",
comment:"ゆーくん"
},
{
to:"さくちゃん",
name:"saku",
question:"治安悪い",
kana:"チアンワルイ",
comment:"もんぼ"
},
{
to:"さくちゃん",
name:"saku",
question:"お前は一生幸せになれよ",
kana:"オマエハイッショウシアワセニナレヨ",
comment:"ゆっこちゃん"
},
{
to:"さくちゃん",
name:"saku",
question:"今日もあざといなあ",
kana:"キョウモアザトイナア",
comment:"ゆっこちゃん"
},
{
to:"ばっしー",
name:"bassy",
question:"大先輩のはるふさんやからしゃーないよな",
kana:"ダイセンパイノハルフサンヤカラシャーナイヨナ",
comment:"けーちゃん"
},
{
to:"ばっしー",
name:"bassy",
question:"人生は慣性の法則だ",
kana:"ジンセイハカンセイノホウソクダ",
comment:"Twitter"
},
{
to:"ばっしー",
name:"bassy",
question:"ばっしーずキッチン",
kana:"バッシーズキッチン",
comment:"ゆっこちゃん"
},
{
to:"はるふ",
name:"ha1f",
question:"LINEににもその機能あるよ",
kana:"LINEニモソノキノウアルヨ",
comment:"けーちゃん"
},
{
to:"はるふ",
name:"ha1f",
question:"LINEに雪が降り出した",
kana:"LINEニユキガフリダシタ",
comment:"Twitter"
},
{
to:"はるふ",
name:"ha1f",
question:"あーーーつらい",
kana:"アーーーツライ",
comment:"Twitter"
},
{
to:"はるふ",
name:"ha1f",
question:"逃げ恥、いいなあと思いつつ、一部辛くなってる自分がいる",
kana:"ニゲハジ、イイナアトオモイツツ、イチブツラクナッテルジブンガイル",
comment:"Twitter"
},
{
to:"はるふ",
name:"ha1f",
question:"今日の飯テロ好評だったな",
kana:"キョウノメシテロコウヒョウダッタナ",
comment:"Twitter"
},
{
to:"はるふ",
name:"ha1f",
question:"あ、星野源ゆるさん",
kana:"ア、ホシノゲンユルサン",
comment:"Twitter"
},
{
to:"はるふ",
name:"ha1f",
question:"プログラミングを例える時は、いつも料理に例える",
kana:"プログラミングヲタトエルトキハ、イツモリョウリニタトエル",
comment:"Twitter"
},
{
to:"はるふ",
name:"ha1f",
question:"コードレビューはiPhoneからしてるよ",
kana:"コードレビューハアイフォンカラシテルヨ",
comment:"Twitter"
},
{
to:"はるふ",
name:"ha1f",
question:"あ、LINEログインできた！",
kana:"ア、LINEログインデキタ！",
comment:"Twitter"
},
{
to:"はるふ",
name:"ha1f",
question:"有村架純と結婚したい",
kana:"アリムラカスミトケッコンシタイ",
comment:"Twitter"
},
{
to:"はるふ",
name:"ha1f",
question:"ぶつかりそうになった時に避ける方向、JISで標準化してほしい",
kana:"ブツカリソウニナッタトキニサケルホウコウ、JISデヒョウジュンカシテホシイ",
comment:"Twitter"
},
{
to:"はるふ",
name:"ha1f",
question:"心が満たされない",
kana:"ココロガミタサレナイ",
comment:"Twitter"
},
{
to:"はるふ",
name:"ha1f",
question:"音楽はとてもエモい気持ちになれる",
kana:"オンガクハトテモエモイキモチニナレル",
comment:"Twitter"
},
{
to:"はるふ",
name:"ha1f",
question:"なんで僕こんなに元気なんだろう",
kana:"ナンデボクハコンナニゲンキナンダロウ",
comment:"Twitter"
},
{
to:"はるふ",
name:"ha1f",
question:"髪切りすぎて神木隆之介",
kana:"カミキリスギテカミキリュウノスケ",
comment:"Twitter"
},
{
to:"はるふ",
name:"ha1f",
question:"東京から帰る新幹線といえば酒",
kana:"トウキョウカラカエルシンカンセントイエバサケ",
comment:"Twitter"
},
{
to:"はるふ",
name:"ha1f",
question:"給与と自分の能力天秤にかけたらエンジニアしか残らなかった",
kana:"キュウヨトジブンノノウリョクテンビンニカケタラエンジニアシカノコラナカッタ",
comment:"うらら"
},
{
to:"はるふ",
name:"ha1f",
question:"メンヘラを許せるのは、メンヘラだけやで",
kana:"メンヘラヲユルセルノハ、メンヘラダケヤデ",
comment:"うらら"
},
{
to:"はるふ",
name:"ha1f",
question:"クソ笑う",
kana:"クソワラウ",
comment:"きゃあ。"
},
{
to:"はるふ",
name:"saku",
question:"リーダーズの時は厳しくしないといけなくてごめんね",
kana:"リーダーズノトキハキビシクシナイトイケナクテゴメンネ",
comment:"ゆっこちゃん"
},
{
to:"はるふ",
name:"saku",
question:"俺たちにも任せてもっと楽に、ワグがまずキャンプ楽しんで！",
kana:"オレタチニモマカセテモットラクニ、ワグガマズキャンプタノシンデ！",
comment:"ゆっこちゃん"
},
{
to:"まなふぃ",
name:"manafy",
question:"東京海上の面接にクリスマスやから赤いセーターに白いパンツで行ったら落とされた",
kana:"トウキョウカイジョウノメンセツニクリスマスヤカラアカイセーターニシロイパンツデイッタラオトサレタ",
comment:"けーちゃん"
},
{
to:"まなふぃ",
name:"manafy",
question:"とりあえず関西弁でキレたらなんとかなる",
kana:"トリアエズカンサイベンデキレタラナントカナル",
comment:"レミー"
},
{
to:"まなふぃ",
name:"manafy",
question:"話題の引き出しを増やせ！",
kana:"ワダイノヒキダシヲフヤセ！",
comment:"クリス"
},
{
to:"ようくん",
name:"yokun",
question:"6000円のプリンはほんまに美味しいから食べたほうがいい",
kana:"ロクセンエンノプリンハホンマオイシイカラタベタホウガイイ",
comment:"けーちゃん"
},
{
to:"ようくん",
name:"yokun",
question:"プリンワンチャンやな",
kana:"プリンワンチャンヤナ",
comment:"きゃあ。"
},
{
to:"ようくん",
name:"yokun",
question:"父親もヘビースモーカーやから",
kana:"チチオヤモヘビースモーカーヤカラ",
comment:"うらら"
},
{
to:"よし",
name:"yoshi",
question:"法則性を見つけたくなる",
kana:"ホウソクセイヲミツケタクナル",
comment:"けーちゃん"},
{
to:"よし",
name:"yoshi",
question:"どんなことをするにも価値のあることにはそれ相応の対価が必要",
kana:"ドンナコトヲスルニモカチノアルコトニハソレソウオウノタイカガヒツヨウ",
comment:"レミー"
},
{
to:"よし",
name:"yoshi",
question:"バナナ、あおったら許さへんで",
kana:"バナナ、アオッタラユルサヘンデ",
comment:"サカナクション"
},
{
to:"りんりん",
name:"rinrin",
question:"洗濯は任せて！プリンとアイス買ってきたよ！ポケットWi-Fi使っていいよ！環境構築は任せた！",
kana:"センタクハマカセテ！プリントアイスカッテキタヨ！ポケットワイファイツカッテイイヨ！カンキョウコウチクハマカセタ！",
comment:"さこぽん"
}
];
