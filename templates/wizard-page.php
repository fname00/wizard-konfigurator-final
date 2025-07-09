<?php if(!defined('ABSPATH')) exit; ?>
<div id="wizard">
  <div id="progress">
    <div id="progress-bar"></div>
    <div id="progress-steps">
      <span data-step="1">1</span>
      <span data-step="2">2</span>
      <span data-step="3">3</span>
    </div>
  </div>
  <div class="step" id="step-1">
    <h2>Wybierz branżę</h2>
    <div class="grid" id="branze-list"></div>
    <h3 id="style-header" style="display:none">Wybierz, które nasze realizacje Ci się podobają (max 5)</h3>
    <div class="grid" id="style-list"></div>
    <div id="after-style" style="display:none">
      <h4>Informacje dodatkowe</h4>
      <textarea id="notes" placeholder="Kilka słów od Ciebie"></textarea>
      <input id="nip" placeholder="NIP firmy">
      <label class="rodo-label"><input type="checkbox" id="rodo"> Zgoda na przetwarzanie danych zgodnie z naszą <a href="/polityka-prywatnosci" target="_blank">polityką prywatności</a></label>
      <button id="next-1">Dalej</button>
    </div>
  </div>
  <div class="step hidden" id="step-2">
    <h2>Co ma robić Twoja strona?</h2>
    <div class="grid" id="cele-list"></div>
    <div id="features-list" style="display:none"></div>
    <input id="tel" placeholder="Telefon">
    <select id="role"><option>Właściciel</option><option>Menedżer</option><option>Pracownik</option></select>
    <label><input type="checkbox" id="whatsapp"> WhatsApp</label>
    <button id="next-2">Dalej</button>
  </div>
  <div class="step hidden" id="step-3">
    <h2>Dopasuj budżet</h2>
    <div id="current-cost">0 zł</div>
    <input type="range" id="budget" min="0" max="50000">
    <div id="budget-summary"></div>
    <div id="summary-list"></div>
    <input id="email" placeholder="Twój email">
    <button id="finish">Prześlij wycenę</button>  </div></div>