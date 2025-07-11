<?php
/*
Plugin Name: Wizard Konfigurator
Description: Konfigurator stron z panelem admina, nonce, mailerem i logiką budżetu.
Version: 1.2
Author: ChatGPT
*/

if (!defined('ABSPATH')) exit;

function kc_sanitize_array($input) {
    if (!is_array($input)) {
        return [];
    }

    foreach ($input as $k => $v) {
        if (is_array($v)) {
            $input[$k] = kc_sanitize_array($v);
        } else {
            $input[$k] = sanitize_text_field($v);
        }
    }

    return $input;
}

// ADMIN MENU & SETTINGS
add_action('admin_menu', function() {
    add_menu_page('Konfigurator', 'Konfigurator', 'manage_options', 'wizard-konfigurator', 'kc_settings_page', 'dashicons-screenoptions', 61);
});
add_action('admin_init', function() {
    register_setting('kc_group', 'konf_branze', ['type' => 'array', 'sanitize_callback' => 'kc_sanitize_array']);
    register_setting('kc_group', 'konf_cele', ['type' => 'array', 'sanitize_callback' => 'kc_sanitize_array']);
    register_setting('kc_group', 'konf_style', ['type' => 'array', 'sanitize_callback' => 'kc_sanitize_array']);
    register_setting('kc_group', 'konf_features', ['type' => 'array', 'sanitize_callback' => 'kc_sanitize_array']);
    register_setting('kc_group', 'konf_style_multiselect');
    add_settings_section('kc_sec', 'Ustawienia Wizard Konfiguratora', null, 'wizard-konfigurator');
    add_settings_field('kc_field_branze', 'Branże', 'kc_render_branze', 'wizard-konfigurator', 'kc_sec');
    add_settings_field('kc_field_cele', 'Cele', 'kc_render_cele', 'wizard-konfigurator', 'kc_sec');
    add_settings_field('kc_field_style', 'Style', 'kc_render_style', 'wizard-konfigurator', 'kc_sec');
    add_settings_field('kc_field_feat', 'Funkcje/Integracje', 'kc_render_features', 'wizard-konfigurator', 'kc_sec');
    add_settings_field('kc_field_style_multi', 'Wybór stylu', 'kc_render_style_multiselect', 'wizard-konfigurator', 'kc_sec');
});

// Admin scripts for dynamic fields and media uploader
add_action('admin_enqueue_scripts', function($hook){
    if($hook !== 'toplevel_page_wizard-konfigurator') return;
    wp_enqueue_media();
    wp_enqueue_script('kc-admin-js', plugins_url('assets/js/admin.js', __FILE__), ['jquery'], null, true);
    wp_localize_script(
        'kc-admin-js',
        'kcAdminData',
        [
            'branze' => array_values((array) get_option('konf_branze')),
            'cele'   => array_values((array) get_option('konf_cele')),
        ]
    );
});

// Render functions with is_array checks
function kc_render_branze() {
    $items = get_option('konf_branze', []);
    if (!is_array($items)) $items = [];
    echo '<table><thead><tr><th>Tytuł</th><th>Slug</th><th>Ikona</th><th></th></tr></thead><tbody>';
    foreach ($items as $i => $b) {
        echo "<tr data-index='{$i}'>";
        echo "<td><input name='konf_branze[{$i}][title]' value='" . esc_attr($b['title']) . "'></td>";
        echo "<td><input name='konf_branze[{$i}][slug]'  value='" . esc_attr($b['slug']) . "'></td>";
        echo "<td><button class='kc_upload button' data-target='kc_b_{$i}_icon'>Wybierz</button>"
           . "<input type='hidden' id='kc_b_{$i}_icon' name='konf_branze[{$i}][icon]' value='" . esc_attr($b['icon']) . "'></td>";
        echo "<td><a href='#' class='kc_remove_row'>&times;</a></td>";
        echo "</tr>";
    }
    echo '</tbody></table><p><button id="kc_add_branza" class="button" type="button">Dodaj branżę</button></p>';
}

function kc_render_cele() {
    $items = get_option('konf_cele', []);
    if (!is_array($items)) $items = [];
    echo '<table><thead><tr><th>Tytuł</th><th>Slug</th><th>Opis</th><th>Badge</th><th></th></tr></thead><tbody>';
    foreach ($items as $i => $c) {
        echo "<tr data-index='{$i}'>";
        echo "<td><input name='konf_cele[{$i}][title]' value='" . esc_attr($c['title']) . "'></td>";
        echo "<td><input name='konf_cele[{$i}][slug]'  value='" . esc_attr($c['slug']) . "'></td>";
        echo "<td><input name='konf_cele[{$i}][desc]' value='" . esc_attr($c['desc']) . "'></td>";
        echo "<td><input name='konf_cele[{$i}][badge]' value='" . esc_attr($c['badge']) . "'></td>";
        echo "<td><a href='#' class='kc_remove_row'>&times;</a></td>";
        echo "</tr>";
    }
    echo '</tbody></table><p><button id="kc_add_cele" class="button" type="button">Dodaj cel</button></p>';
}

function kc_render_style() {
    $items = get_option('konf_style', []);
    if (!is_array($items)) $items = [];
    $branze = get_option('konf_branze', []);
    if (!is_array($branze)) $branze = [];
    echo '<table><thead><tr><th>Branża</th><th>Tytuł</th><th>Opis</th><th>Ikona</th><th>Budżet min.</th><th></th></tr></thead><tbody>';
    foreach ($items as $i => $s) {
        echo "<tr data-index='{$i}'>";
        echo '<td><select name="konf_style['.$i.'][branch]">';
        foreach ($branze as $b) {
            $sel = ($b['slug'] === $s['branch']) ? 'selected' : '';
            echo "<option value='{$b['slug']}' {$sel}>{$b['title']}</option>";
        }
        echo '</select></td>';
        echo "<td><input name='konf_style[{$i}][title]' value='" . esc_attr($s['title']) . "'></td>";
        echo "<td><input name='konf_style[{$i}][desc]' value='" . esc_attr($s['desc']) . "'></td>";
        echo '<td><button class="kc_upload button" data-target="kc_s_'.$i.'_icon">Wybierz</button>'
           . '<input type="hidden" id="kc_s_'.$i.'_icon" name="konf_style['.$i.'][icon]" value="'.esc_attr($s['icon']).'"></td>';
        echo "<td><input name='konf_style[{$i}][minbudget]' value='" . esc_attr($s['minbudget']) . "' placeholder='5000'></td>";
        echo "<td><a href='#' class='kc_remove_row'>&times;</a></td>";
        echo "</tr>";
    }
    echo '</tbody></table><p><button id="kc_add_style" class="button" type="button">Dodaj styl</button></p>';
}

function kc_render_features() {
    $items = get_option('konf_features', []);
    if (!is_array($items)) $items = [];
    $cele  = get_option('konf_cele', []);
    if (!is_array($cele)) $cele = [];
    echo '<table><thead><tr><th>Tytuł</th><th>Opis</th><th>Ikona</th><th>Badge</th><th>Kolor</th><th>Typ</th><th>Cena</th><th>Przypisane cele</th><th></th></tr></thead><tbody>';
    foreach ($items as $i => $f) {
        echo "<tr data-index='{$i}'>";
        echo "<td><input name='konf_features[{$i}][title]' value='" . esc_attr($f['title']) . "'></td>";
        echo "<td><input name='konf_features[{$i}][desc]' value='" . esc_attr($f['desc']) . "'></td>";
        echo '<td><button class="kc_upload button" data-target="kc_f_'.$i.'_icon">Wybierz</button>'
           . '<input type="hidden" id="kc_f_'.$i.'_icon" name="konf_features['.$i.'][icon]" value="'.esc_attr($f['icon']).'"></td>';
        echo "<td><input name='konf_features[{$i}][badge_text]' value='" . esc_attr($f['badge_text']) . "'></td>";
        echo "<td><input type='color' name='konf_features[{$i}][badge_color]' value='" . esc_attr($f['badge_color']) . "'></td>";
        echo '<td><select name="konf_features['.$i.'][type]">'
           . '<option value="funkcja"'.($f['type']=='funkcja'?' selected':'').'>Funkcja</option>'
           . '<option value="automatyzacja"'.($f['type']=='automatyzacja'?' selected':'').'>Automatyzacja</option>'
           . '<option value="integracja"'.($f['type']=='integracja'?' selected':'').'>Integracja</option>'
           . '</select></td>';
        echo "<td><input name='konf_features[{$i}][price]' value='" . esc_attr($f['price']) . "' placeholder='2000'></td>";
        echo '<td>';
        foreach ($cele as $c) {
            $chk = in_array($c['slug'], $f['assigned'] ?? []) ? 'checked' : '';
            echo "<label><input type='checkbox' name='konf_features[{$i}][assigned][]' value='{$c['slug']}' {$chk}> {$c['title']}</label><br>";
        }
        echo '</td><td><a href="#" class="kc_remove_row">&times;</a></td></tr>';
    }
    echo '</tbody></table><p><button id="kc_add_feature" class="button" type="button">Dodaj pozycję</button></p>';
}

function kc_render_style_multiselect() {
    $val = get_option('konf_style_multiselect', '1');
    echo '<label><input type="radio" name="konf_style_multiselect" value="0" '.checked($val, '0', false).'> pojedynczy</label><br>';
    echo '<label><input type="radio" name="konf_style_multiselect" value="1" '.checked($val, '1', false).'> wielokrotny</label>';
}

// SETTINGS PAGE
function kc_settings_page() {
    include plugin_dir_path(__FILE__) . 'admin/settings-page.php';
}

// PRESET DATA + reset to arrays if needed
register_activation_hook(__FILE__, function() {
    update_option('konf_branze', [
        ['title'=>'Nieruchomosci','slug'=>'nieruchomosci','icon'=>''],
        ['title'=>'E-commerce','slug'=>'ecommerce','icon'=>''],
        ['title'=>'Uslugi premium','slug'=>'premium','icon'=>''],
        ['title'=>'Edukacja','slug'=>'edukacja','icon'=>''],
        ['title'=>'Gastronomia','slug'=>'gastronomia','icon'=>''],
        ['title'=>'Motoryzacja','slug'=>'motoryzacja','icon'=>'']
    ]);
    update_option('konf_cele', [
        ['title'=>'Zbieranie leadów','slug'=>'leady','desc'=>'','badge'=>''],
        ['title'=>'Sklep online','slug'=>'sklep','desc'=>'','badge'=>''],
        ['title'=>'Portal płatny','slug'=>'portal','desc'=>'','badge'=>''],
        ['title'=>'Wizerunkowa','slug'=>'wizerunkowa','desc'=>'','badge'=>'']
    ]);
    if (!is_array(get_option('konf_style'))) update_option('konf_style', []);
    if (!is_array(get_option('konf_features'))) update_option('konf_features', []);
    if (get_option('konf_style_multiselect') === false) update_option('konf_style_multiselect', '1');
});

// SHORTCODE & AJAX
add_shortcode('wizard_konfigurator', function() {
    ob_start();
    include plugin_dir_path(__FILE__) . 'templates/wizard-page.php';
    return ob_get_clean();
});
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('wizard-css', plugins_url('assets/css/wizard.css', __FILE__));
    wp_enqueue_script('wizard-js', plugins_url('assets/js/wizard.js', __FILE__), ['jquery'], null, true);
    wp_localize_script('wizard-js', 'wizardData', [
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('wizard_nonce'),
        'branże'  => array_values((array) get_option('konf_branze')),
        'cele'    => array_values((array) get_option('konf_cele')),
        'style'   => array_values((array) get_option('konf_style')),
        'features'=> array_values((array) get_option('konf_features')),
        'styleMulti' => get_option('konf_style_multiselect', '1')
    ]);
});
add_action('wp_ajax_save_wizard_step', 'kc_save_step');
add_action('wp_ajax_nopriv_save_wizard_step', 'kc_save_step');
function kc_save_step() {
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'wizard_nonce')) {
        wp_send_json_error(['message'=>'Brak nonce'], 403);
    }
    $post_id = intval($_POST['post_id']);
    if (!$post_id) {
        $post_id = wp_insert_post(['post_title'=>'Zapytanie','post_status'=>'draft']);
    }
    foreach ((array) $_POST['meta'] as $k => $v) {
        update_post_meta($post_id, sanitize_key($k), sanitize_text_field($v));
    }
    if (!empty($_POST['meta']['email'])) {
        wp_mail(
            sanitize_email($_POST['meta']['email']),
            'Twoja wycena strony',
            "Dziękujemy za konfigurację! \n\nTwoje ID zapytania: $post_id\nWkrótce się z Tobą skontaktujemy.",
            ['Content-Type: text/plain; charset=UTF-8', 'From: info@twojadomena.pl']
        );
    }
    wp_send_json_success(['post_id'=>$post_id]);
}
