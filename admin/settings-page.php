<?php if(!defined('ABSPATH')) exit; ?>
<div class="wrap">
  <h1>Wizard Konfigurator — Ustawienia</h1>
  <form method="post" action="options.php">
    <?php settings_fields('kc_group'); do_settings_sections('wizard-konfigurator'); ?>
    <h2>Tryb wyboru stylu</h2>
    <?php $val = get_option('konf_style_multiselect', '1'); ?>
    <label><input type="radio" name="konf_style_multiselect" value="0" <?php checked($val,'0'); ?>> pojedynczy</label>
    <label><input type="radio" name="konf_style_multiselect" value="1" <?php checked($val,'1'); ?>> wielokrotny</label>
    <?php submit_button(); ?>
  </form>
</div>