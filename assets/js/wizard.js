(function($){
  var postId = 0;
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
  wizardData.features.forEach(function(f){
    $('#features-list').append('<label><input type="checkbox" data-slug="'+f.slug+'" data-price="'+f.price+'"> '+f.title+' (+'+f.price+'zł)</label>');
  });
  $('#branze-list').on('click','.branża',function(){ $('.branża').removeClass('active'); $(this).addClass('active'); });
  $('#next-1').click(function(){
    if(!$('#rodo').prop('checked')) return alert('Zgoda RODO wymagana');
    save({branza:$('.branża.active').data('slug'), notes:$('#notes').val(), nip:$('#nip').val(), rodo:1},function(){
      $('#step-1').fadeOut(200,function(){ $('#step-2').fadeIn(200); });
    });
  });
  $('#cele-list').on('click','.cel',function(){ $('.cel').removeClass('active'); $(this).addClass('active'); });
  $('#next-2').click(function(){
    save({cel:$('.cel.active').data('slug'), tel:$('#tel').val(), role:$('#role').val(), whatsapp:$('#whatsapp').prop('checked')?1:0},function(){
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
  });
})(jQuery);