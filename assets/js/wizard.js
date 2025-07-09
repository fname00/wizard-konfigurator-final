(function($){
  function toArray(obj){
    return Array.isArray(obj)?obj:Object.values(obj||{});
  }
  var postId = 0;
  var styleSel = [];
  var styleLimit = 5;
  var selectedFeatures = [];
  var selectedGoals = [];

  function renderFeatures(){
    $('#features-list').empty();
    if(!selectedGoals.length){ $('#features-list').hide(); return; }
    var groups = {funkcja:[],integracja:[],automatyzacja:[]};
    toArray(wizardData.features).forEach(function(f){
      if(!f.assigned || selectedGoals.some(function(g){ return f.assigned.indexOf(g)!==-1; })){
        if(!groups[f.type]) groups[f.type]=[];
        groups[f.type].push(f);
      }
    });
    ['funkcja','integracja','automatyzacja'].forEach(function(type){
      var list=groups[type];
      if(!list||!list.length) return;
      $('#features-list').append('<h3>'+type.charAt(0).toUpperCase()+type.slice(1)+'</h3>');
      var table=$('<table class="feat-table"><tbody></tbody></table>');
      list.forEach(function(f){
        var desc=f.desc||f.description||'';
        var img = f.icon ? '<img src="'+f.icon+'" alt="">' : '';
        table.append('<tr><td><label class="feature-tag" data-title="'+f.title+'" data-price="'+(f.price||0)+'">'+img+'<input type="checkbox" data-price="'+(f.price||0)+'" value="'+f.title+'"> <span>'+f.title+'</span></label></td><td>'+desc+'</td></tr>');
      });
      table.append('<tr><td colspan="2"><label><input type="checkbox" value="inne-'+type+'"> inne, niestandardowe rozwiązania</label></td></tr>');
      $('#features-list').append(table);
    });
    $('#features-list').fadeIn(200);
  }

  function updateNext1(){
    var nipFilled = $('#nip').val().trim() !== '';
    var rodoOk    = $('#rodo').prop('checked');
    var allOk     = styleSel.length >= 1 && nipFilled && rodoOk;

    if(allOk){
      $('#next-1').show();
    }else{
      $('#next-1').hide();
    }

    $('#next-1').prop('disabled', !allOk);
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
  var $branchSelect = $('#branch-select');
  var $styleLimitMsg = $('<div id="style-limit-msg" class="hidden">Możesz wybrać maksymalnie '+styleLimit+' stylów</div>');
  $('#style-list').after($styleLimitMsg);
  $branchSelect.empty().append('<option value="" selected disabled>Wybierz branżę</option>');
  toArray(wizardData['branże']).forEach(function(b){
    $branchSelect.append('<option value="'+b.slug+'">'+b.title+'</option>');
  });
  $branchSelect.val('');
  toArray(wizardData.cele).forEach(function(c){
    $('#cele-list').append('<div class="cel" data-slug="'+c.slug+'">'+c.title+'</div>');
  });
  // features will be rendered after selecting a goal
  function loadBranch(slug, title){
    $('#branch-select').val(slug);
    styleSel = [];
    $('#style-list').empty();
    $('#phone-carousel').empty();
    toArray(wizardData.style).forEach(function(s){
      if(s.branch===slug){
        var img = s.icon ? '<img src="'+s.icon+'" alt="">' : '';
        var item = '<div class="style" data-title="'+s.title+'">'+img+'<span>'+s.title+'</span></div>';
        $('#style-list').append(item);
        $('#phone-carousel').append(item);
      }
    });
    $('#style-header').fadeIn(200);
    $('#after-style').hide();
    $('.style').removeClass('disabled');
    $styleLimitMsg.addClass('hidden');
    $('#next-1').prop('disabled', true).hide();
    updateNext1();
  }

  $('#branch-select').on('change', function(){
    var slug = $(this).val();
    var title = $('#branch-select option:selected').text();
    if(slug){
      loadBranch(slug, title);
    }
  });

  $('#style-list, #phone-carousel').on('click','.style',function(){
    var title=$(this).data('title');
    if($(this).hasClass('active')){
      $(this).removeClass('active');
      styleSel = styleSel.filter(function(t){ return t!==title; });
    }else{
      if(styleSel.length>=styleLimit){
        $styleLimitMsg.removeClass('hidden');
        $('.style').not('.active').addClass('disabled');
        return;
      }
      $(this).addClass('active');
      styleSel.push(title);
    }
    if(styleSel.length<styleLimit){
      $('.style').removeClass('disabled');
      $styleLimitMsg.addClass('hidden');
    }else{
      $('.style').not('.active').addClass('disabled');
      $styleLimitMsg.removeClass('hidden');
    }
    if(styleSel.length>=1){
      $('#after-style').fadeIn(200);
    }else{
      $('#after-style').hide();
    }
    updateNext1();
  });

  $('#nip').on('input', updateNext1);
  $('#rodo').on('change', function(){
    $(this).next('.custom-checkbox').toggleClass('checked', this.checked);
    updateNext1();
  });
  $('#next-1').click(function(){
    if(!$('#rodo').prop('checked')) return alert('Zgoda RODO wymagana');
    if($('#nip').val().trim()==='') return alert('Podaj NIP firmy');
    save({branza:$('#branch-select').val(), style:styleSel.join(','), notes:$('#notes').val(), nip:$('#nip').val(), rodo:1},function(){
      $('#step-1').fadeOut(200,function(){ $('#step-2').fadeIn(200); setProgress(2); });
    });
  });
  $('#cele-list').on('click','.cel',function(){
    var slug=$(this).data('slug');
    if($(this).hasClass('active')){
      $(this).removeClass('active');
      selectedGoals = selectedGoals.filter(function(s){ return s!==slug; });
    }else{
      $(this).addClass('active');
      if(selectedGoals.indexOf(slug)===-1) selectedGoals.push(slug);
    }
    renderFeatures();
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
    save({cel:selectedGoals.join(','), features:feats, tel:$('#tel').val(), role:$('#role').val(), whatsapp:$('#whatsapp').prop('checked')?1:0},function(){
      $('#step-2').fadeOut(200,function(){
        $('#step-3').fadeIn(200);
        setProgress(3);
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
    if(!/^[^@]+@[^@]+\.[^@]+$/.test(email)){
      alert('Podaj poprawny email');
      return;
    }
    save({budget:$('#budget').val(), email: email}, function(){
      alert('Wycena wysłana!');
      location.reload();
    });
  });

  // phone carousel drag support
  var $carousel = $('#phone-carousel');
  if($carousel.length){
    var dragging = false;
    var startX = 0;
    var startScroll = 0;
    $carousel.on('touchstart mousedown', function(e){
      dragging = true;
      startX = e.pageX || e.originalEvent.touches[0].pageX;
      startScroll = $carousel.scrollLeft();
    });
    $carousel.on('touchmove mousemove', function(e){
      if(!dragging) return;
      var x = e.pageX || e.originalEvent.touches[0].pageX;
      $carousel.scrollLeft(startScroll - (x - startX));
      e.preventDefault();
    });
    $(document).on('touchend mouseup touchcancel', function(){
      dragging = false;
    });
  }
})(jQuery);
