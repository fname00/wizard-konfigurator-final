(function($){
  var postId = 0;
  var styleSel = [];
  function save(meta, cb){
    $.post(wizardData.ajaxurl, {
      action: 'save_wizard_step',
      nonce:  wizardData.nonce,
      post_id: postId,
      meta:    meta
    }, function(res){
      if(res.success){ postId = res.data.post_id; cb && cb(); }
      else alert('Błąd: '+res.data.message);
    });
  }
  wizardData['branże'].forEach(function(b){
    $('#branze-list').append('<div class="branża" data-slug="'+b.slug+'">'+b.title+'</div>');
  });
  wizardData.cele.forEach(function(c){
    $('#cele-list').append('<div class="cel" data-slug="'+c.slug+'">'+c.title+'</div>');
  });
  // features will be rendered after selecting a goal
  $('#branze-list').on('click','.branża',function(){
    $('.branża').removeClass('active');
    $(this).addClass('active');
    var slug=$(this).data('slug');
    styleSel=[];
    $('#style-list').empty();
    wizardData.style.forEach(function(s){
      if(s.branch===slug){
        var img=s.icon?'<img src="'+s.icon+'" alt="">':'';
        $('#style-list').append('<div class="style" data-title="'+s.title+'">'+img+'<span>'+s.title+'</span></div>');
      }
    });
    $('#style-header').fadeIn(200);
    $('#after-style').hide();
    $('#next-1').prop('disabled', true);
  });

  $('#style-list').on('click','.style',function(){
    var title=$(this).data('title');
    if($(this).hasClass('active')){
      $(this).removeClass('active');
      styleSel = styleSel.filter(function(t){ return t!==title; });
    }else{
      if(styleSel.length>=5) return;
      $(this).addClass('active');
      styleSel.push(title);
    }
    if(styleSel.length>=5){
      $('#after-style').fadeIn(200);
      $('#next-1').prop('disabled', false);
    }else{
      $('#after-style').hide();
      $('#next-1').prop('disabled', true);
    }
  });
  $('#next-1').click(function(){
    if(!$('#rodo').prop('checked')) return alert('Zgoda RODO wymagana');
    save({branza:$('.branża.active').data('slug'), style:styleSel.join(','), notes:$('#notes').val(), nip:$('#nip').val(), rodo:1},function(){
      $('#step-1').fadeOut(200,function(){ $('#step-2').fadeIn(200); });
    });
  });
  $('#cele-list').on('click','.cel',function(){
    $('.cel').removeClass('active');
    $(this).addClass('active');
    var slug=$(this).data('slug');
    $('#features-list').empty();
    wizardData.features.forEach(function(f){
      if(!f.assigned || f.assigned.indexOf(slug)!==-1){
        $('#features-list').append('<label><input type="checkbox" value="'+f.title+'"> '+f.title+'</label><br>');
      }
    });
    $('#features-list').fadeIn(200);
  });
  $('#next-2').click(function(){
    var feats = $('#features-list input:checked').map(function(){return $(this).val();}).get().join(',');
    save({cel:$('.cel.active').data('slug'), features:feats, tel:$('#tel').val(), role:$('#role').val(), whatsapp:$('#whatsapp').prop('checked')?1:0},function(){
      $('#step-2').fadeOut(200,function(){ $('#step-3').fadeIn(200); });
    });
  });
  $('#budget').on('input change',function(){
    var v=$(this).val(), text='Budżet: '+v+' zł';
    if(v<10000) text+='\nOgraniczony zakres.'; else text+='\nPełny zakres funkcji.';
    $('#budget-summary').text(text);
  });
  $('#finish').click(function(){
    var email=$('#email').val();
    if(!email||email.indexOf('@')<0){ alert('Podaj poprawny email'); return; }
    save({budget:$('#budget').val(), email: email}, function(){
      alert('Wycena wysłana!'); location.reload();
    });
  });})(jQuery);