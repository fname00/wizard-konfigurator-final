<?php if(!defined('ABSPATH')) exit; ?>
<div class="wrap">
  <h1>Wizard Konfigurator — Ustawienia</h1>
  <form method="post" action="options.php">
    <?php settings_fields('kc_group'); do_settings_sections('wizard-konfigurator'); submit_button(); ?>
  </form>
</div>