/* This file contains mappings of better formatted instrument names from Yahoo Finance

To accelerate the process of writing these maps, build a portfolio on Yahoo Finance and run these commands in the console:

const symbols = [...document.querySelectorAll('[aria-label="Symbol"]')].map(sym => sym.textContent)
const names = [...document.querySelectorAll('[aria-label="Company Name"]')].map(name => name.textContent)
symbols.map((sym, ind) => `[${sym}] ${names[ind]}`) 

Copy the formatted array and append the instrument ID's as keys

Instrument Table: https://www.npmjs.com/package/dukascopy-node#forex */

module.exports = {
  forex: {
    eurusd: '[EURUSD=X] EUR-USD'
  },
  stocks: {
    mmmususd: '[MMM] 3M Company',
    axpususd: '[AXP] American Express Company',
    aaplususd: '[AAPL] Apple Inc.',
    baususd: '[BA] The Boeing Company',
    catususd: '[CAT] Caterpillar Inc.',
    cvxususd: '[CVX] Chevron Corporation',
    cscoususd: '[CSCO] Cisco Systems, Inc.',
    koususd: '[KO] The Coca-Cola Company',
    xomususd: '[XOM] Exxon Mobil Corporation',
    gsususd: '[GS] The Goldman Sachs Group, Inc.',
    hdususd: '[HD] The Home Depot, Inc.',
    ibmususd: '[IBM] International Business Machines Corporation',
    intcususd: '[INTC] Intel Corporation',
    jnjususd: '[JNJ] Johnson & Johnson',
    jpmususd: '[JPM] JPMorgan Chase & Co.',
    mcdususd: "[MCD] McDonald's Corporation",
    mrkususd: '[MRK] Merck & Co., Inc.',
    msftususd: '[MSFT] Microsoft Corporation',
    nkeususd: '[NKE] NIKE, Inc.',
    pfeususd: '[PFE] Pfizer Inc.',
    pgususd: '[PG] The Procter & Gamble Company',
    trvususd: '[TRV] The Travelers Companies, Inc.',
    unhususd: '[UNH] UnitedHealth Group Incorporated',
    utxususd: '[UTX] United Technologies Corporation',
    vzususd: '[VZ] Verizon Communications Inc.',
    vususd: '[V] Visa Inc.',
    wmtususd: '[WMT] Walmart Inc.',
    wbaususd: '[WBA] Walgreens Boots Alliance, Inc.',
    disususd: '[DIS] The Walt Disney Company'
  },
  ETF: {
    diaususd: '[DOW] Dow Inc.'
  },
  crypto: {
    btcusd: '[BTC-USD] Bitcoin',
    ethusd: '[ETH-USD] Ethereum'
  }
}
