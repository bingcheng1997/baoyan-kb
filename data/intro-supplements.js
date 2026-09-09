// ===== 补充板块：7 类资格 / 名额分配 / 流程图 =====
function renderQualTypes() {
  const container = document.getElementById('qual-types');
  if (!container || !window.POLICY_DATA) return;
  const q = window.POLICY_DATA.qualifications;
  container.innerHTML = q.types.map(t => {
    const list = (t.details || t.whitelist || []).map(item => '<li>' + item + '</li>').join('');
    return '<div style="margin-bottom:16px; padding:12px 16px; background:var(--color-bg-secondary); border-radius:6px; border-left:3px solid var(--color-xdf-green);">'
      + '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">'
      + '<b style="color:var(--color-xdf-green);">' + t.name + '</b>'
      + '<span style="background:white; padding:2px 8px; border-radius:999px; font-size:11px; color:var(--color-text-tertiary);">占推免总数 ' + t.share + '</span>'
      + '</div>'
      + '<p style="margin:4px 0; font-size:13px;"><b>资格标准</b>：' + t.standard + '</p>'
      + (list ? '<ul style="margin:6px 0; padding-left:20px; font-size:12px; color:var(--color-text-secondary);">' + list + '</ul>' : '')
      + '<p style="margin:4px 0; font-size:11px; color:var(--color-text-tertiary); font-style:italic;">💡 ' + t.note + '</p>'
      + '</div>';
  }).join('');
}

function renderAllocLayers() {
  const container = document.getElementById('alloc-layers');
  if (!container || !window.POLICY_DATA) return;
  const a = window.POLICY_DATA.allocation;
  container.innerHTML = a.layers.map(layer => {
    let body = '';
    if (layer.ratios) {
      body = '<table style="width:100%; border-collapse:collapse; font-size:12px; margin:8px 0;">'
        + '<thead><tr style="background:white;"><th style="padding:6px; text-align:left;">档次</th><th style="padding:6px; text-align:left;">推免比例</th><th style="padding:6px; text-align:left;">典型院校</th></tr></thead>'
        + '<tbody>'
        + layer.ratios.map(r => '<tr><td style="padding:6px;"><b>' + r.tier + '</b></td><td style="padding:6px; color:var(--color-xdf-green); font-weight:700;">' + r.ratio + '</td><td style="padding:6px; color:var(--color-text-tertiary); font-size:11px;">' + r.examples + '</td></tr>').join('')
        + '</tbody></table>';
    } else if (layer.rules) {
      body = '<ul style="margin:8px 0; padding-left:20px; font-size:13px;">' + layer.rules.map(r => '<li><b>' + r.direction + '</b>：<span style="color:var(--color-xdf-green); font-weight:700;">' + r.ratio + '</span></li>').join('') + '</ul>';
    } else if (layer.types) {
      body = '<ul style="margin:8px 0; padding-left:20px; font-size:13px;">' + layer.types.map(t => '<li>' + t + '</li>').join('') + '</ul>';
    }
    return '<div style="margin-bottom:16px; padding:12px 16px; background:var(--color-bg-secondary); border-radius:6px; border-left:3px solid #FF7D00;">'
      + '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">'
      + '<b style="color:#FF7D00;">' + layer.name + '</b>'
      + '<span style="background:white; padding:2px 8px; border-radius:999px; font-size:11px; color:var(--color-text-tertiary);">占推免总数 ' + layer.share + '</span>'
      + '</div>'
      + '<p style="margin:4px 0; font-size:13px;">' + layer.rule + '</p>'
      + body
      + '</div>';
  }).join('');

  const ex = a.layers[0].examples;
  container.innerHTML += '<div style="background:linear-gradient(135deg, var(--color-xdf-green-pale), white); padding:16px; border-radius:8px; border:1px solid var(--color-xdf-green); margin-top:16px;">'
    + '<b style="color:var(--color-xdf-green);">📊 基础名额计算示例</b>'
    + '<ul style="margin:8px 0; padding-left:20px; font-size:13px;">'
    + ex.map(e => '<li>' + e.desc + ' = <b style="color:var(--color-xdf-green);">' + e.value + '</b></li>').join('')
    + '</ul></div>';
}

function renderWorkflow() {
  const container = document.getElementById('workflow-stages');
  if (!container || !window.POLICY_DATA) return;
  const w = window.POLICY_DATA.workflow;
  container.innerHTML = '<div style="display:flex; flex-direction:column; gap:12px;">' + w.stages.map(s => {
    const branches = s.branches ? '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:8px;">' + s.branches.map(b => '<div style="background:white; padding:8px; border-radius:4px; border-left:2px solid var(--color-xdf-green);"><b>' + b.name + '</b> <span style="font-size:10px; color:var(--color-text-tertiary);">' + b.time + '</span><ul style="margin:4px 0; padding-left:14px; font-size:11px;">' + b.actions.map(a => '<li>' + a + '</li>').join('') + '</ul></div>').join('') + '</div>' : '';
    return '<div style="padding:12px 16px; background:var(--color-bg-secondary); border-radius:6px; position:relative;">'
      + '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">'
      + '<b style="color:var(--color-xdf-green);">' + s.stage + ' · ' + s.name + '</b>'
      + '<span style="background:white; padding:2px 8px; border-radius:999px; font-size:11px; color:var(--color-text-tertiary);">' + s.time + '</span>'
      + '</div>'
      + '<ul style="margin:4px 0; padding-left:20px; font-size:12px; color:var(--color-text-secondary);">'
      + (s.actions || []).map(a => '<li>' + a + '</li>').join('')
      + '</ul>'
      + branches
      + '</div>';
  }).join('') + '</div>';
}

renderQualTypes();
renderAllocLayers();
renderWorkflow();
console.log('[Intro Page] 补充数据加载完成');