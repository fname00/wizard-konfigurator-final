<?php if(!defined('ABSPATH')) exit; ?>
<style>
  .headline {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
  }
  .subheadline {
    font-family: 'Inter', sans-serif;
    font-size: 20px;
  }
</style>
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
    <h2 class="intro-title headline">Wybierz branżę dla swojej strony internetowej</h2>
    <p class="intro-desc subheadline">Dzięki temu dopasujemy styl i funkcje do Twoich potrzeb.</p>
    <div class="grid" id="branze-list">
      <select id="branch-select" class="branch-select glass-control">
        <option value="" selected disabled>Wybierz branżę</option>
      </select>
    </div>
    <h3 id="style-header" class="subheadline" style="display:none">Wybierz, które nasze realizacje Ci się podobają (maks. 5)</h3>
    <div class="grid" id="style-list"></div>
    <div id="after-style" style="display:none">
      <h4>Informacje dodatkowe</h4>
      <textarea id="notes" class="glass-control" placeholder="Opisz styl jaki Ci się podoba"></textarea>
      <input id="nip" class="glass-control" placeholder="NIP firmy">
      <label class="rodo-label"><input type="checkbox" id="rodo"><span class="custom-checkbox"></span> Zgoda na przetwarzanie danych zgodnie z naszą <a href="/polityka-prywatnosci" target="_blank">polityką prywatności</a></label>
      <button id="next-1" class="cta-btn">Dalej</button>
    </div>
  </div>
  <div class="step hidden" id="step-2">
    <h2 class="headline">Co Ciebie interesuje?</h2>
    <div class="grid" id="cele-list"></div>
    <div id="features-list" style="display:none">
      <div id="funkcja-section" class="feature-section">
        <h3 class="subheadline">Wybierz interesujące Cię funkcje</h3>
        <p>Zaznacz funkcje, które mogą być dla Ciebie przydatne, nawet jeśli nie wiesz, czy w pełni je wykorzystasz.</p>
        <div class="feature-table"></div>
      </div>
      <div id="integracja-section" class="feature-section">
        <h3 class="subheadline">Wybierz integracje</h3>
        <p>Jeśli brakuje jakiejś integracji na tej liście, zaznacz podobną do tej, której potrzebujesz lub inną...</p>
        <div class="feature-table"></div>
      </div>
      <div id="automatyzacja-section" class="feature-section">
        <h3 class="subheadline">Wybierz pomocne Ci automatyzacje</h3>
        <p>Automatyzacje skracają czas pracy.</p>
        <div class="feature-table"></div>
      </div>
    </div>
    <input id="tel" class="glass-control" placeholder="Telefon">
    <select id="role" class="glass-control"><option>Właściciel</option><option>Menedżer</option><option>Pracownik</option></select>
    <label><input type="checkbox" id="whatsapp"> WhatsApp</label>
    <button id="next-2" class="cta-btn">Dalej</button>
  </div>
  <div class="step hidden" id="step-3">
    <h2 class="headline">Dopasuj budżet</h2>
    <div id="current-cost">0 zł</div>
    <input type="range" id="budget" min="0" max="50000" class="glass-control">
    <div id="budget-summary"></div>
    <div id="summary-list"></div>
      <h3 class="subheadline">E-mail do przesłania wyceny</h3>
      <input id="email" class="glass-control" placeholder="Twój email">
      <button id="finish" class="cta-btn" disabled>Prześlij wycenę</button>
  </div>
</div>

