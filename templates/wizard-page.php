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
    <h2 class="intro-title">Wybierz branżę dla swojej strony internetowej</h2>
    <p class="intro-desc">Dzięki temu dopasujemy styl i funkcje do Twoich potrzeb</p>
    <div class="grid" id="branze-list">
      <select id="branch-select" class="branch-select">
        <option value="" selected disabled>Wybierz branżę</option>
      </select>
    </div>
    <h3 id="style-header" style="display:none">Wybierz, które nasze realizacje Ci się podobają (max 5)</h3>
    <div class="grid" id="style-list"></div>
    <div id="after-style" style="display:none">
      <h4>Informacje dodatkowe</h4>
      <textarea id="notes" placeholder="Opisz styl jaki Ci się podoba"></textarea>
      <input id="nip" placeholder="NIP firmy">
      <label class="rodo-label"><input type="checkbox" id="rodo"><span class="custom-checkbox"></span> Zgoda na przetwarzanie danych zgodnie z naszą <a href="/polityka-prywatnosci" target="_blank">polityką prywatności</a></label>
      <button id="next-1">Dalej</button>
    </div>
  </div>
  <div class="step hidden" id="step-2">
    <h2>Co Ciebie interesuje?</h2>
    <div class="grid" id="cele-list"></div>
    <div id="features-list" style="display:none">
      <div id="funkcja-section" class="feature-section">
        <h3>Wybierz interesujące Cię funkcje</h3>
        <p>Zaznacz funkcje które mogą być dla Ciebie przydatne, nawet jeśli nie wiesz czy w pełni je wykorzystasz.</p>
        <div class="feature-table"></div>
      </div>
      <div id="integracja-section" class="feature-section">
        <h3>Wybierz Integracje</h3>
        <p>Jeśli brakuje jakiejś integracji na tej liście, zaznacz podobne do tej co potrzebujesz lub inne...</p>
        <div class="feature-table"></div>
      </div>
      <div id="automatyzacja-section" class="feature-section">
        <h3>Wybierz pomocne Ci automatyzacje</h3>
        <p>Automatyzacje skracają czas pracy...</p>
        <div class="feature-table"></div>
      </div>
    </div>
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
    <h3>Email do przesłania wyceny</h3>
    <input id="email" placeholder="Twój email">
    <button id="finish" disabled>Prześlij wycenę</button>
  </div>
</div>

