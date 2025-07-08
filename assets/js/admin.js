jQuery(function($){
  function addBranzaRow(){
    var t = $('#kc_add_branza').prev('table').find('tbody');
    var idx = t.children('tr').length;
    t.append('<tr data-index="'+idx+'">'+
      '<td><input name="konf_branze['+idx+'][title]"></td>'+
      '<td><input name="konf_branze['+idx+'][slug]"></td>'+
      '<td><button class="kc_upload button" data-target="kc_b_'+idx+'_icon">Wybierz</button>'+
      '<input type="hidden" id="kc_b_'+idx+'_icon" name="konf_branze['+idx+'][icon]" value=""></td>'+
      '<td><a href="#" class="kc_remove_row">&times;</a></td>'+
    '</tr>');
  }
  function addCelRow(){
    var t = $('#kc_add_cele').prev('table').find('tbody');
    var idx = t.children('tr').length;
    t.append('<tr data-index="'+idx+'">'+
      '<td><input name="konf_cele['+idx+'][title]"></td>'+
      '<td><input name="konf_cele['+idx+'][slug]"></td>'+
      '<td><a href="#" class="kc_remove_row">&times;</a></td>'+
    '</tr>');
  }
  function addStyleRow(){
    var t = $('#kc_add_style').prev('table').find('tbody');
    var idx = t.children('tr').length;
    var sel = '<select name="konf_style['+idx+'][branch]">';
    (kcAdminData.branze||[]).forEach(function(b){ sel+='<option value="'+b.slug+'">'+b.title+'</option>'; });
    sel += '</select>';
    t.append('<tr data-index="'+idx+'">'+
      '<td>'+sel+'</td>'+
      '<td><input name="konf_style['+idx+'][title]"></td>'+
      '<td><input name="konf_style['+idx+'][desc]"></td>'+
      '<td><button class="kc_upload button" data-target="kc_s_'+idx+'_icon">Wybierz</button>'+
      '<input type="hidden" id="kc_s_'+idx+'_icon" name="konf_style['+idx+'][icon]" value=""></td>'+
      '<td><input name="konf_style['+idx+'][minbudget]" placeholder="5000"></td>'+
      '<td><a href="#" class="kc_remove_row">&times;</a></td>'+
    '</tr>');
  }
  function addFeatureRow(){
    var t = $('#kc_add_feature').prev('table').find('tbody');
    var idx = t.children('tr').length;
    var cele = '';
    (kcAdminData.cele||[]).forEach(function(c){ cele += '<label><input type="checkbox" name="konf_features['+idx+'][assigned][]" value="'+c.slug+'"> '+c.title+'</label><br>'; });
    t.append('<tr data-index="'+idx+'">'+
      '<td><input name="konf_features['+idx+'][title]"></td>'+
      '<td><select name="konf_features['+idx+'][type]"><option value="funkcja">Funkcja</option><option value="automatyzacja">Automatyzacja</option><option value="integracja">Integracja</option></select></td>'+
      '<td><input name="konf_features['+idx+'][price]" placeholder="2000"></td>'+
      '<td>'+cele+'</td>'+
      '<td><a href="#" class="kc_remove_row">&times;</a></td>'+
    '</tr>');
  }
  $('#kc_add_branza').on('click', function(e){e.preventDefault();addBranzaRow();});
  $('#kc_add_cele').on('click', function(e){e.preventDefault();addCelRow();});
  $('#kc_add_style').on('click', function(e){e.preventDefault();addStyleRow();});
  $('#kc_add_feature').on('click', function(e){e.preventDefault();addFeatureRow();});
  $(document).on('click','.kc_remove_row',function(e){e.preventDefault();$(this).closest('tr').remove();});
  var frame;
  $(document).on('click','.kc_upload',function(e){
    e.preventDefault();
    var target = $(this).data('target');
    frame = wp.media({title:'Wybierz obraz',button:{text:'Użyj'},multiple:false});
    frame.on('select',function(){ var att=frame.state().get('selection').first().toJSON(); $('#'+target).val(att.url); });
    frame.open();
  });
});
