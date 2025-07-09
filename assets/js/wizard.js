(function($){
  function toArray(obj){
    return Array.isArray(obj)?obj:Object.values(obj||{});
  }
  var postId = 0;
  var styleSel = [];
  var selectedFeatures = [];

  function updateNext1(){
    var nipFilled = $('#nip').val().trim() !== '';
    var rodoOk    = $('#rodo').prop('checked');
    if(styleSel.length>=1 && nipFilled && rodoOk){
      $('#next-1').prop('disabled', false).show();
    }else{
      $('#next-1').prop('disabled', true).hide();
    }
  }
  function updateBudgetText(v){
    var text='Budżet: '+v+' zł';
    if(v<10000) text+='\nOgraniczony zakres.'; else text+='\nPełny zakres funkcji.';
    $('#budget-summary').text(text);
  }
  function setProgress(step){
    $('#progress-bar').css('width', ((step-1)/2*100)+'%');
    $('#progress-steps span').removeClass('active');
    $('#progress-steps span[data-step="'+step+'"]').addClass('active');
  }
  setProgress(1);
  $('#next-1').hide();
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
  toArray(wizardData['branże']).forEach(function(b){
    $('#branze-list').append('<div class="branża" data-slug="'+b.slug+'">'+b.title+'</div>');
  });
  toArray(wizardData.cele).forEach(function(c){
    $('#cele-list').append('<div class="cel" data-slug="'+c.slug+'">'+c.title+'</div>');
  });
  // features will be rendered after selecting a goal
  $('#branze-list').on('click','.branża',function(){
    var $this=$(this);
    if($this.hasClass('active')){
      $this.removeClass('active');
      $('#branze-list .branża').slideDown();
      $('#style-list').empty();
      $('#style-header').hide();
      $('#after-style').hide();
      $('#next-1').prop('disabled', true).hide();
      updateNext1();
      styleSel=[];
      return;
    }
    $('#branze-list .branża').not($this).slideUp();
    $('#branze-list .branża').removeClass('active');
    $this.addClass('active').slideDown();
    var slug=$this.data('slug');
    styleSel=[];
    $('#style-list').empty();
    toArray(wizardData.style).forEach(function(s){
      if(s.branch===slug){
        var img=s.icon?'<img src="'+s.icon+'" alt="">':'';
        $('#style-list').append('<div class="style" data-title="'+s.title+'">'+img+'<span>'+s.title+'</span></div>');
      }
    });
    $('#style-header').fadeIn(200);
    $('#after-style').hide();
    $('#next-1').prop('disabled', true).hide();
    updateNext1();
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
    if(styleSel.length>=1){
      $('#after-style').fadeIn(200);
    }else{
      $('#after-style').hide();
    }
    updateNext1();
  });

  $('#nip').on('input', updateNext1);
  $('#rodo').on('change', updateNext1);
  $('#next-1').click(function(){
    if(!$('#rodo').prop('checked')) return alert('Zgoda RODO wymagana');
    if($('#nip').val().trim()==='') return alert('Podaj NIP firmy');
    save({branza:$('.branża.active').data('slug'), style:styleSel.join(','), notes:$('#notes').val(), nip:$('#nip').val(), rodo:1},function(){
      $('#step-1').fadeOut(200,function(){ $('#step-2').fadeIn(200); setProgress(2); });
    });
  });
  $('#cele-list').on('click','.cel',function(){
    $('.cel').removeClass('active');
    $(this).addClass('active');
    var slug=$(this).data('slug');
    $('#features-list').empty();
    selectedFeatures=[];
    $('#features-list .feature-table').empty();
    $('#features-list .feature-section').hide();
    var groups={funkcja:[],integracja:[],automatyzacja:[]};
    toArray(wizardData.features).forEach(function(f){
      if(!f.assigned || f.assigned.indexOf(slug)!==-1){
        if(!groups[f.type]) groups[f.type]=[];
        groups[f.type].push(f);
      }
    });
    var hasAny=false;
    ['funkcja','integracja','automatyzacja'].forEach(function(type){
      var list=groups[type];
      if(!list||!list.length) return;
      $('#features-list').append('<h3>'+type.charAt(0).toUpperCase()+type.slice(1)+'</h3>');
      var cont=$('<div class="tag-container"></div>');
      var $section = $('#'+type+'-section');
      if(!list||!list.length){ $section.hide(); return; }
      var table=$('<table class="feat-table"><tbody></tbody></table>');
      list.forEach(function(f){
        var desc=f.desc||f.description||'';
        cont.append('<div class="tag feature-tag" data-price="'+(f.price||0)+'" data-title="'+f.title+'" title="'+desc+'">'+f.title+'</div>');
      });
      cont.append('<div class="tag feature-tag" data-price="0" data-title="inne-'+type+'">inne, niestandardowe rozwiązania</div>');
      $('#features-list').append(cont);
    });
      $('#features-list').fadeIn(200);
  });
  $('#features-list').on('click','.feature-tag',function(){
    var $t=$(this);
    var title=$t.data('title');
    var price=parseInt($t.data('price'))||0;
    if($t.hasClass('selected')){
      $t.removeClass('selected');
      selectedFeatures=selectedFeatures.filter(function(f){return f.title!==title;});
    }else{
      $t.addClass('selected');
      selectedFeatures.push({title:title,price:price});
    }
      table.append('<tr><td colspan="2"><label><input type="checkbox" value="inne-'+type+'"> inne, niestandardowe rozwiązania</label></td></tr>');
      $section.find('.feature-table').append(table);
      $section.show();
      hasAny=true;
    });
    if(hasAny) $('#features-list').fadeIn(200);
  });
  $('#next-2').click(function(){
    var tel = $('#tel').val().trim();
    if(!tel){
      alert('Podaj numer telefonu');
      return;
    }
      selectedFeatures = $('.feature-tag.selected').map(function(){
        return {title: $(this).data('title'), price: parseInt($(this).data('price'))||0};
      }).get();
    var feats = selectedFeatures.map(function(f){return f.title;}).join(',');
    var cost = selectedFeatures.reduce(function(s,f){return s+f.price;},0);
      $('#summary-list').empty();
      selectedFeatures.forEach(function(f){
        $('#summary-list').append('<div class="tag summary-item selected" data-price="'+f.price+'">'+f.title+' ('+f.price+' zł)</div>');
      });
    $('#current-cost').text(cost+' zł');
    $('#budget').val(cost);
    updateBudgetText(cost);
    save({cel:$('.cel.active').data('slug'), features:feats, tel:$('#tel').val(), role:$('#role').val(), whatsapp:$('#whatsapp').prop('checked')?1:0},function(){
      $('#step-2').fadeOut(200,function(){
        $('#step-3').fadeIn(200);
        setProgress(3);
        $('#finish').prop('disabled', true);
      });
    });
  });
  $('#budget').on('input change',function(){
    updateBudgetText($(this).val());
  });
  $('#summary-list').on('click','.summary-item',function(){
    $(this).toggleClass('selected');
    var total=0;
    $('#summary-list .summary-item.selected').each(function(){ total+=parseInt($(this).data('price')); });
    $('#current-cost').text(total+' zł');
    $('#budget').val(total);
    updateBudgetText(total);
  });
  var emailValid=false;
  $('#email').on('input',function(){
    emailValid=/^[^@]+@[^@]+\.[^@]+$/.test($(this).val().trim());
    $('#finish').prop('disabled', !emailValid);
  });
  $('#finish').click(function(){
    var email=$('#email').val();
    if(!email||email.indexOf('@')<0){ alert('Podaj poprawny email'); return; }    save({budget:$('#budget').val(), email: email}, function(){      alert('Wycena wysłana!'); location.reload();    });  });})(jQuery);
    if(!/^[^@]+@[^@]+\.[^@]+$/.test(email)){ alert('Podaj poprawny email'); return; }    save({budget:$('#budget').val(), email: email}, function(){      alert('Wycena wysłana!'); location.reload();    });  });})(jQuery);