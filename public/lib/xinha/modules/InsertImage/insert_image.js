/*--------------------------------------:noTabs=true:tabSize=2:indentSize=2:--
    --  Xinha (is not htmlArea) - http://xinha.org
    --
    --  Use of Xinha is granted by the terms of the htmlArea License (based on
    --  BSD license)  please read license.txt in this package for details.
    --
    --  Copyright (c) 2005-2008 Xinha Developer Team and contributors
    --
    --  This is the Xinha standard implementation of an image insertion plugin
    --
    --  he file is loaded as a special plugin by the Xinha Core when no alternative method (plugin) is loaded.
    --
    --
    --  $HeadURL$
    --  $LastChangedDate$
    --  $LastChangedRevision$
    --  $LastChangedBy$
--------------------------------------------------------------------------*/

InsertImage._pluginInfo = {
  name          : "InsertImage",
  origin        : "Xinha Core",
  version       : "$LastChangedRevision$".replace(/^[^:]*:\s*(.*)\s*\$$/, '$1'),
  developer     : "The Xinha Core Developer Team",
  developer_url : "$HeadURL$".replace(/^[^:]*:\s*(.*)\s*\$$/, '$1'),
  sponsor       : "",
  sponsor_url   : "",
  license       : "htmlArea"
};
    
function InsertImage(editor) {
  this.editor = editor;
  var cfg = editor.config;
  var self = this;
       
  if(typeof editor._insertImage == 'undefined'){
    editor._insertImage = function() { self.show(); };
    // editor.config.btnList.insertimage[3] = function() { self.show(); }
  }
}
      
InsertImage.prototype._lc = function(string) {
  return Xinha._lc(string, 'InsertImage');
};
    
InsertImage.prototype.onGenerateOnce = function(){
  InsertImage.loadAssets();
};
    
InsertImage.loadAssets = function(){
  var self = InsertImage;
  if (self.loading) return;
  self.loading = true;
  Xinha._getback(_editor_url + 'modules/InsertImage/dialog.html', function(getback) { self.html = getback; self.dialogReady = true; });
  Xinha._getback(_editor_url + 'modules/InsertImage/pluginMethods.js', function(getback) { eval(getback); self.methodsReady = true; });
};

InsertImage.prototype.onUpdateToolbar = function(){ 
  if (!(InsertImage.dialogReady && InsertImage.methodsReady)){
    this.editor._toolbarObjects.insertimage.state("enabled", false);
  }
  else this.onUpdateToolbar = null;
};
      
InsertImage.prototype.prepareDialog = function(){
  var self = this;
  var editor = this.editor;
      
  var dialog = this.dialog = new Xinha.Dialog(editor, InsertImage.html, 'Xinha',{width:410})
  // Connect the OK and Cancel buttons
  dialog.getElementById('ok').onclick = function() { 
    
  var param = {
    "f_url": dialog.getElementById('f_url').value,
    "f_alt": dialog.getElementById('f_alt') ? dialog.getElementById('f_alt').value : '',
    "f_border": dialog.getElementById('f_border') ? dialog.getElementById('f_border').value : '',
    "f_align": dialog.getElementById('f_align') ? dialog.getElementById('f_align').value : '',
    "f_vert": dialog.getElementById('f_vert') ? dialog.getElementById('f_vert').value : '',
    "f_horiz": dialog.getElementById('f_horiz') ? dialog.getElementById('f_horiz').value : ''
  };
    
  var img = '<img src="' + param["f_url"] + '" alt="' + param["f_alt"] + '"';
  if (param["f_border"]) img += ' border="' + param["f_border"] + '"';
  if (param["f_align"]) img += ' align="' + param["f_align"] + '"';
  if (param["f_vert"]) img += ' vspace="' + param["f_vert"] + '"';
  if (param["f_horiz"]) img += ' hspace="' + param["f_horiz"] + '"';
  img += ' />';
      
  editor.insertHTML(img);
  self.dialog.hide();    
};
    
  dialog.getElementById('cancel').onclick = function() { self.dialog.hide()};
    
  dialog.getElementById('preview').onclick = function() { 
    var f_url = dialog.getElementById("f_url");
    var url = f_url.value;
    
    if (!url) {
      alert(dialog._lc("You must enter the URL"));
      f_url.focus();
      return false;
    }

    dialog.getElementById('ipreview').src = url;
    return false;
  }

  this.dialog.onresize = function ()
  {
    var newHeightForPreview = 
    parseInt(this.height,10) 
    - this.getElementById('h1').offsetHeight 
    - this.getElementById('buttons').offsetHeight
    - this.getElementById('inputs').offsetHeight 
    - parseInt(this.rootElem.style.paddingBottom,10); // we have a padding at the bottom, gotta take this into acount       

    this.getElementById("ipreview").style.height = ((newHeightForPreview > 0) ? newHeightForPreview : 0) + "px"; // no-go beyond 0
        
    this.getElementById("ipreview").style.width = this.width - 2   + 'px'; // and the width
    
  }

  this.dialogReady = true; 

  document.getElementById('uploadButton').addEventListener('click', function() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    var formData = new FormData();
    formData.append('file', file);

    // 환경 변수에서 URL 가져오기
    const baseUrl = window.REACT_APP_BASE_URL;
    // console.log('baseUrl: ', baseUrl);

    // 내부망에서 업로드 할 때
    fetch( baseUrl + 'documents/image/', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {

      // data를 받을 때 앞부분의 editor_image/ 글자를 제거하는 코드
      let inputString = data.data;
      let result = inputString.replace('editor_image/', '');

      // 내부망에서 서버에 이미지를 참조할 때
      var fullUrl = baseUrl + 'static/'+ result;

      // 이미지 넣는 페이지에서 파일선택 후 적용버튼을 누르면 아래 어떤 링크로 주소를 받는지 확인 하는 코드
      // console.log('fullUrl: ', fullUrl);
          
      // Image URL input 값 설정
      var imageUrlInput = document.getElementById('f_url');
      if (imageUrlInput) {
        imageUrlInput.value = fullUrl;
        imageUrlInput.title = data.filename;
      } else {
        console.error('Element with id f_url not found.');
      }
      
      // 자동으로 미리보기 설정
      var previewButton = document.getElementById('preview');
      if (previewButton) {
        previewButton.click();
      } else {
        console.error('Element with id preview not found.');
      }
      // 콘솔에 파일명 출력
      // console.log('Uploaded File Name: ' + data.filename);
    })
    .catch(error => {
      console.error('Error uploading file:', error);
    });
  });
      
  document.getElementById('preview').addEventListener('click', function() {
    var imageUrlInput = document.getElementById('f_url');
    var previewFrame = document.getElementById('ipreview');
    if (imageUrlInput && previewFrame) {
      previewFrame.src = imageUrlInput.value;
    } else {
      console.error('Element with id f_url or ipreview not found.');
    }
  });
};
    
InsertImage.prototype.apply = function(param) {
  var editor = this.editor;
  var f_url = param["f_url"];
  var f_alt = param["f_alt"] ? param["f_alt"] : '';
  var f_border = param["f_border"] ? param["f_border"] : '';
  var f_align = param["f_align"] ? param["f_align"] : '';
  var f_vert = param["f_vert"] ? param["f_vert"] : '';
  var f_horiz = param["f_horiz"] ? param["f_horiz"] : '';
    
  var img = '<img src="' + f_url + '" alt="' + f_alt + '"';
  if (f_border) img += ' border="' + f_border + '"';
  if (f_align) img += ' align="' + f_align + '"';
  if (f_vert) img += ' vspace="' + f_vert + '"';
  if (f_horiz) img += ' hspace="' + f_horiz + '"';
  img += ' />';

  editor.insertHTML(img);
};
    
this.dialogReady = true;