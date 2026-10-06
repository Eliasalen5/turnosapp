const socket = io();

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function currency(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value ?? 0);
}

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  return res.json();
}

async function refreshServices() {
  const tbody = document.getElementById('services-tbody');
  if (!tbody) return;

  const data = await fetchJSON('/api/services?limit=100&sort=createdAt&order=desc');
  if (data.status !== 'success') return;

  if (!data.payload.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty">No hay servicios cargados</td></tr>';
    return;
  }

  tbody.innerHTML = data.payload
    .map(
      (service) => `
      <tr>
        <td>${esc(service.name)}</td>
        <td>${esc(service.category)}</td>
        <td>${esc(service.duration)} min</td>
        <td>${currency(service.price)}</td>
        <td>${service.available ? 'Sí' : 'No'}</td>
        <td><button class="btn btn-danger btn-delete-service" data-id="${service._id}">Eliminar</button></td>
      </tr>`
    )
    .join('');
}

async function refreshReservations() {
  const tbody = document.getElementById('reservations-tbody');
  if (!tbody) return;

  const data = await fetchJSON('/api/reservations');
  if (data.status !== 'success') return;

  if (!data.payload.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">No hay reservas creadas</td></tr>';
    return;
  }

  tbody.innerHTML = data.payload
    .map((reservation) => {
      const items = reservation.services
        .map(
          (item) =>
            `<span class="badge">${esc(item.service?.name ?? 'Servicio eliminado')} × ${item.quantity}</span>`
        )
        .join('');
      const total = reservation.services.reduce((acc, item) => acc + item.quantity, 0);
      const created = new Date(reservation.createdAt).toLocaleString('es-AR', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
      return `
      <tr>
        <td>#${esc(String(reservation._id).slice(-6))}</td>
        <td>${items || '<span class="empty">Sin servicios</span>'}</td>
        <td>${total}</td>
        <td>${created}</td>
        <td><button class="btn btn-danger btn-delete-reservation" data-id="${reservation._id}">Eliminar</button></td>
      </tr>`;
    })
    .join('');
}

function showMessage(text, type) {
  const message = document.getElementById('form-message');
  if (!message) return;
  message.textContent = text;
  message.className = `form-message ${type}`;
}

const serviceForm = document.getElementById('service-form');
serviceForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(serviceForm);

  const payload = {
    name: formData.get('name'),
    category: formData.get('category') || 'general',
    duration: Number(formData.get('duration')),
    price: Number(formData.get('price')),
    description: formData.get('description') || '',
    available: formData.get('available') === 'on',
  };

  const data = await fetchJSON('/api/services', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (data.status === 'success') {
    serviceForm.reset();
    showMessage('Servicio creado correctamente', 'ok');
  } else {
    showMessage(data.message, 'error');
  }
});

document.addEventListener('click', async (event) => {
  const deleteService = event.target.closest('.btn-delete-service');
  if (deleteService) {
    await fetchJSON(`/api/services/${deleteService.dataset.id}`, { method: 'DELETE' });
    return;
  }

  const deleteReservation = event.target.closest('.btn-delete-reservation');
  if (deleteReservation) {
    await fetchJSON(`/api/reservations/${deleteReservation.dataset.id}`, { method: 'DELETE' });
  }
});

socket.on('service:created', refreshServices);
socket.on('service:updated', refreshServices);
socket.on('service:deleted', refreshServices);

socket.on('reservation:created', refreshReservations);
socket.on('reservation:updated', refreshReservations);
socket.on('reservation:deleted', refreshReservations);
