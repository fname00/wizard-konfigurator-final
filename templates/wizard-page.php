<?php if(!defined('ABSPATH')) exit; ?>
<div id="wizard">
  <div class="step" id="step-1">
    <h2>Wybierz branżę</h2>
    <div class="grid" id="branze-list"></div>
    <textarea id="notes" placeholder="Kilka słów od Ciebie"></textarea>
    <input id="nip" placeholder="NIP firmy">
    <label><input type="checkbox" id="rodo"> Zgoda RODO</label>
    <button id="next-1">Dalej</button>
  </div>
  <div class="step hidden" id="step-2">
    <h2>Co ma robić Twoja strona?</h2>
    <div class="grid" id="cele-list"></div>
    <div class="grid" id="features-list"></div>
    <input id="tel" placeholder="Telefon">
    <select id="role"><option>Właściciel</option><option>Menedżer</option><option>Pracownik</option></select>
    <label><input type="checkbox" id="whatsapp"> WhatsApp</label>
    <button id="next-2">Dalej</button>
  </div>
  <div class="step hidden" id="step-3">
    <h2>Dopasuj budżet</h2>
    <input type="range" id="budget" min="5000" max="50000">
    <div id="budget-summary"></div>
    <input id="email" placeholder="Twój email">
    <button id="finish">Prześlij wycenę</button>
  </div>
</div>