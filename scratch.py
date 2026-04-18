import re

with open('diagnostico.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the new parts
header_and_form = """            <!-- Form Header & Progress -->
            <div class="text-center mb-10">
                <h1 class="font-headline text-3xl md:text-4xl font-bold mb-4">Descubre cuánto dinero estás perdiendo</h1>
                <p class="text-white/70">Responde a estas breves preguntas y descubre cuánto estás dejando de ingresar por no gestionar bien tus contactos.</p>

                <div class="flex items-center justify-center gap-4 mt-8">
                    <!-- Progress Dots (4 pasos) -->
                    <div class="flex items-center gap-1 sm:gap-2">
                        <div id="dot-1" class="w-2.5 h-2.5 rounded-full bg-primary transition-colors duration-300">
                        </div>
                        <div class="w-6 sm:w-8 h-px bg-white/20"></div>
                        <div id="dot-2" class="w-2.5 h-2.5 rounded-full bg-white/20 transition-colors duration-300">
                        </div>
                        <div class="w-6 sm:w-8 h-px bg-white/20"></div>
                        <div id="dot-3" class="w-2.5 h-2.5 rounded-full bg-white/20 transition-colors duration-300">
                        </div>
                        <div class="w-6 sm:w-8 h-px bg-white/20"></div>
                        <div id="dot-4" class="w-2.5 h-2.5 rounded-full bg-white/20 transition-colors duration-300">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Form Container -->
            <div class="glass-panel p-8 md:p-10 shadow-[0_0_50px_rgba(138,43,226,0.1)]">
                <form id="diagnosticoForm">
                    <!-- Paso 1: Datos Personales Antes de Empezar -->
                    <div id="step1" class="step active">
                        <h2 class="font-headline text-xl font-bold mb-6 text-primaryLight">Antes de empezar...</h2>
                        <p class="text-white/70 mb-6">Por favor, indícanos a dónde enviamos tu diagnóstico.</p>
                        <div class="space-y-6">
                            <div class="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Teléfono móvil</label>
                                        <input type="tel" name="telefono" id="telefono_basico" required
                                            class="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                            placeholder="+34 600... ">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Nombre completo <span class="text-xs text-white/50">(opcional)</span></label>
                                        <input type="text" name="nombre" id="nombre_basico"
                                            class="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-8 flex justify-end">
                            <button type="button" onclick="nextStep(2)"
                                class="btn w-full md:w-auto px-8 btn-primary bg-gradient-to-r from-primary to-primaryLight text-white font-bold font-headline rounded-full shadow-[0_0_20px_rgba(138,43,226,0.5)] hover:shadow-[0_0_40px_rgba(138,43,226,0.7)] hover:scale-105 transition-all duration-300">Comenzar
                                Diagnóstico <svg class="w-4 h-4 ml-2 inline" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" stroke-width="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg></button>
                        </div>
                    </div>

                    <!-- Paso 2: Volumen de negocio -->
                    <div id="step2" class="step">
                        <h2 class="font-headline text-xl font-bold mb-6 text-primaryLight">1. Volumen de negocio</h2>
                        <div class="space-y-6">

                            <div class="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-white/80 mb-2">Tipo de servicio principal</label>
                                    <input type="text" name="tipo_servicio" placeholder="Ej: Clínica estética, Fisioterapia, etc." required
                                        class="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-white/80 mb-3">¿Cuál es tu ticket medio aproximado por cliente?</label>
                                    <div class="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                        <label
                                            class="border border-white/10 rounded-lg px-3 py-2 text-center text-sm cursor-pointer hover:border-primary/50 transition-colors bg-dark/30 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                            <input type="radio" name="ticket_medio" data-value="30" value="Menos de 50€" class="sr-only" required>Menos de 50€
                                        </label>
                                        <label
                                            class="border border-white/10 rounded-lg px-3 py-2 text-center text-sm cursor-pointer hover:border-primary/50 transition-colors bg-dark/30 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                            <input type="radio" name="ticket_medio" data-value="75" value="50€ - 100€" class="sr-only">50€ - 100€
                                        </label>
                                        <label
                                            class="border border-white/10 rounded-lg px-3 py-2 text-center text-sm cursor-pointer hover:border-primary/50 transition-colors bg-dark/30 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                            <input type="radio" name="ticket_medio" data-value="150" value="100€ - 200€" class="sr-only">100€ - 200€
                                        </label>
                                        <label
                                            class="border border-white/10 rounded-lg px-3 py-2 text-center text-sm cursor-pointer hover:border-primary/50 transition-colors bg-dark/30 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                            <input type="radio" name="ticket_medio" data-value="350" value="200€ - 500€" class="sr-only">200€ - 500€
                                        </label>
                                        <label
                                            class="border border-white/10 rounded-lg px-3 py-2 text-center text-sm cursor-pointer hover:border-primary/50 transition-colors bg-dark/30 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                            <input type="radio" name="ticket_medio" data-value="750" value="500€ - 1000€" class="sr-only">500€ - 1000€
                                        </label>
                                        <label
                                            class="border border-white/10 rounded-lg px-3 py-2 text-center text-sm cursor-pointer hover:border-primary/50 transition-colors bg-dark/30 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                            <input type="radio" name="ticket_medio" data-value="1500" value="Más de 1000€" class="sr-only">Más de 1000€
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-white/80 mb-3">¿Cuántas citas calculas que se pierden o cancelan a la semana?</label>
                                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                        <label
                                            class="border border-white/10 rounded-lg px-3 py-2 text-center text-sm cursor-pointer hover:border-primary/50 transition-colors bg-dark/30 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                            <input type="radio" name="citas_perdidas" data-value="2" value="1-3 citas" class="sr-only" required>1-3 citas
                                        </label>
                                        <label
                                            class="border border-white/10 rounded-lg px-3 py-2 text-center text-sm cursor-pointer hover:border-primary/50 transition-colors bg-dark/30 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                            <input type="radio" name="citas_perdidas" data-value="5" value="4-6 citas" class="sr-only">4-6 citas
                                        </label>
                                        <label
                                            class="border border-white/10 rounded-lg px-3 py-2 text-center text-sm cursor-pointer hover:border-primary/50 transition-colors bg-dark/30 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                            <input type="radio" name="citas_perdidas" data-value="8" value="7-10 citas" class="sr-only">7-10 citas
                                        </label>
                                        <label
                                            class="border border-white/10 rounded-lg px-3 py-2 text-center text-sm cursor-pointer hover:border-primary/50 transition-colors bg-dark/30 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                            <input type="radio" name="citas_perdidas" data-value="12" value="Más de 10 citas" class="sr-only">Más de 10
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-8 flex justify-between gap-4">
                            <button type="button" onclick="prevStep(1)"
                                class="btn w-full md:w-auto px-6 btn-secondary bg-white/10 text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">Atrás</button>
                            <button type="button" onclick="nextStep(3)"
                                class="btn w-full md:w-auto px-8 btn-primary bg-gradient-to-r from-primary to-primaryLight text-white font-bold font-headline rounded-full shadow-[0_0_20px_rgba(138,43,226,0.5)] hover:shadow-[0_0_40px_rgba(138,43,226,0.7)] hover:scale-105 transition-all duration-300">Siguiente
                                <svg class="w-4 h-4 ml-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg></button>
                        </div>
                    </div>

                    <!-- Paso 3: Atención -->
                    <div id="step3" class="step">
                        <h2 class="font-headline text-xl font-bold mb-6 text-primaryLight">2. Atención al Cliente</h2>
                        <div class="space-y-6">

                            <div>
                                <label class="block text-sm font-medium text-white/80 mb-3">¿Cómo gestionáis las llamadas entrantes que no podéis atender al momento?</label>
                                <div class="grid grid-cols-1 gap-3">
                                    <label
                                        class="border border-white/10 rounded-lg px-4 py-3 text-sm cursor-pointer hover:border-primary/50 transition-colors bg-white/5 flex items-center has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                        <input type="radio" name="gestion_llamadas" data-penalty="0" value="Se devuelve la llamada rápido" class="sr-only" required><span>Devolvemos la llamada lo antes posible siempre.</span>
                                    </label>
                                    <label
                                        class="border border-white/10 rounded-lg px-4 py-3 text-sm cursor-pointer hover:border-primary/50 transition-colors bg-white/5 flex items-center has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                        <input type="radio" name="gestion_llamadas" data-penalty="5" value="A veces se nos pasan" class="sr-only"><span>Intentamos llamar, pero a veces se nos pasa.</span>
                                    </label>
                                    <label
                                        class="border border-white/10 rounded-lg px-4 py-3 text-sm cursor-pointer hover:border-primary/50 transition-colors bg-white/5 flex items-center has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                        <input type="radio" name="gestion_llamadas" data-penalty="10" value="Muchas se pierden" class="sr-only"><span>Si estamos ocupados, se pierden y no se devuelve la llamada.</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-white/80 mb-3">¿Cuánto tardáis en responder un mensaje de WhatsApp normalmente?</label>
                                <div class="grid grid-cols-1 gap-3">
                                    <label
                                        class="border border-white/10 rounded-lg px-4 py-3 text-sm cursor-pointer hover:border-primary/50 transition-colors bg-white/5 flex items-center has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                        <input type="radio" name="gestion_whatsapp" data-penalty="0" value="Al instante / Menos de 1h" class="sr-only" required><span>Menos de 1 hora.</span>
                                    </label>
                                    <label
                                        class="border border-white/10 rounded-lg px-4 py-3 text-sm cursor-pointer hover:border-primary/50 transition-colors bg-white/5 flex items-center has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                        <input type="radio" name="gestion_whatsapp" data-penalty="5" value="Un par de horas" class="sr-only"><span>Un par de horas.</span>
                                    </label>
                                    <label
                                        class="border border-white/10 rounded-lg px-4 py-3 text-sm cursor-pointer hover:border-primary/50 transition-colors bg-white/5 flex items-center has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                        <input type="radio" name="gestion_whatsapp" data-penalty="10" value="A veces respondemos al día siguiente" class="sr-only"><span>A veces respondemos al día siguiente o se nos olvida.</span>
                                    </label>
                                </div>
                            </div>

                        </div>
                        <div class="mt-8 flex justify-between gap-4">
                            <button type="button" onclick="prevStep(2)"
                                class="btn w-full md:w-auto px-6 btn-secondary bg-white/10 text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">Atrás</button>
                            <button type="button" onclick="nextStep(4)"
                                class="btn w-full md:w-auto px-8 btn-primary bg-gradient-to-r from-primary to-primaryLight text-white font-bold font-headline rounded-full shadow-[0_0_20px_rgba(138,43,226,0.5)] hover:shadow-[0_0_40px_rgba(138,43,226,0.7)] hover:scale-105 transition-all duration-300">Siguiente
                                <svg class="w-4 h-4 ml-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg></button>
                        </div>
                    </div>

                    <!-- Paso 4: Seguimiento -->
                    <div id="step4" class="step">
                        <h2 class="font-headline text-xl font-bold mb-6 text-primaryLight">3. Seguimiento</h2>
                        <div class="space-y-6">

                            <div>
                                <label class="block text-sm font-medium text-white/80 mb-3">Si alguien pide información pero no reserva en el momento, ¿qué hacéis?</label>
                                <div class="grid grid-cols-1 gap-3">
                                    <label
                                        class="border border-white/10 rounded-lg px-4 py-3 text-sm cursor-pointer hover:border-primary/50 transition-colors bg-white/5 flex items-center has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                        <input type="radio" name="seguimiento" data-penalty="0" value="Hacemos seguimiento programado" class="sr-only" required><span>Hacemos seguimiento para intentar que vengan.</span>
                                    </label>
                                    <label
                                        class="border border-white/10 rounded-lg px-4 py-3 text-sm cursor-pointer hover:border-primary/50 transition-colors bg-white/5 flex items-center has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                        <input type="radio" name="seguimiento" data-penalty="5" value="Solo recordamos a veces" class="sr-only"><span>Solo si nos acordamos o hay poca gente ese día.</span>
                                    </label>
                                    <label
                                        class="border border-white/10 rounded-lg px-4 py-3 text-sm cursor-pointer hover:border-primary/50 transition-colors bg-white/5 flex items-center has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                        <input type="radio" name="seguimiento" data-penalty="10" value="No hacemos seguimiento" class="sr-only"><span>Esperamos a que ellos vuelvan a escribir.</span>
                                    </label>
                                </div>
                            </div>

                        </div>
                        <div class="mt-8 flex justify-between gap-4">
                            <button type="button" onclick="prevStep(3)"
                                class="btn w-full md:w-auto px-6 btn-secondary bg-white/10 text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">Atrás</button>
                            <button type="button" onclick="calculateAndSubmit()"
                                class="btn w-full px-8 text-white btn-primary bg-gradient-to-r from-primary to-primaryLight text-white font-bold font-headline rounded-full shadow-[0_0_20px_rgba(138,43,226,0.5)] hover:shadow-[0_0_40px_rgba(138,43,226,0.7)] hover:scale-105 transition-all duration-300">Ver Resultado</button>
                        </div>
                    </div>

                    <!-- Pantalla Analizando -->
                    <div id="analyzingState" class="step text-center py-10">
                        <div class="w-16 h-16 rounded-full border-4 border-white/10 border-t-primary animate-spin mx-auto mb-6"
                            id="spinner"></div>
                        <h2 class="font-headline text-2xl font-bold mb-4">Estamos analizando tus respuestas...</h2>
                        <p class="text-white/70 mb-8 max-w-sm mx-auto">Detectando posibles pérdidas en citas y seguimiento...</p>
                    </div>

                    <!-- Paso 5: Resultado y CTA -->
                    <div id="resultState" class="step py-6">
                        <div class="text-center">
                            <h2 class="font-headline text-2xl md:text-3xl font-bold mb-2 text-primaryLight">Estás dejando de ingresar</h2>
                            <div class="text-5xl md:text-6xl font-bold mb-4 font-headline text-white" id="weeklyLossRange">
                                -- €
                            </div>
                            <p class="text-lg text-white/70 mb-6">Eso supone <span class="font-bold text-white" id="annualLossRange">-- €</span> al año.</p>
                            
                            <p class="text-xl font-medium mb-10 pb-6 border-b border-white/10">Y esto ocurre cada semana sin que te des cuenta.</p>

                            <a href="reserva.html"
                                class="btn w-full max-w-md mx-auto btn-primary bg-gradient-to-r from-primary to-primaryLight text-white font-bold font-headline rounded-full shadow-[0_0_20px_rgba(138,43,226,0.5)] hover:shadow-[0_0_40px_rgba(138,43,226,0.7)] hover:scale-105 transition-all duration-300 py-4 text-lg">
                                Ver cómo recuperar estas citas
                            </a>
                            <p class="text-white/50 text-sm mt-4 max-w-sm mx-auto">En 10–15 min veremos tu caso. Si no encaja, te lo diré directamente.</p>

                            <div class="mt-8 bg-white/5 p-4 rounded-xl">
                                <p class="text-white/60 text-sm italic">Más del 80% de centros con los que hablamos no eran conscientes de esto antes de verlo.</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>"""

script_block = """    <script>
        const dots = [
            document.getElementById('dot-1'),
            document.getElementById('dot-2'),
            document.getElementById('dot-3'),
            document.getElementById('dot-4')
        ];

        function showStep(stepNum) {
            document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
            document.getElementById(`step${stepNum}`).classList.add('active');

            dots.forEach((dot, index) => {
                if (!dot) return;
                if (index < stepNum) {
                    dot.classList.add('border-primary', 'bg-primary/20');
                    dot.classList.remove('border-white/20');
                    if (dot.querySelector('div')) dot.querySelector('div').className = 'w-2.5 h-2.5 rounded-full bg-primary transition-colors duration-300';
                } else {
                    dot.classList.remove('border-primary', 'bg-primary/20');
                    dot.classList.add('border-white/20');
                    if (dot.querySelector('div')) dot.querySelector('div').className = 'w-2.5 h-2.5 rounded-full bg-white/20 transition-colors duration-300';
                }
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function prevStep(stepNum) {
            showStep(stepNum);
        }

        async function nextStep(stepNum) {
            const currentStep = document.querySelector('.step.active');

            // HTML5 Validation
            const inputs = Array.from(currentStep.querySelectorAll('input, select, textarea'));
            for (let input of inputs) {
                if (!input.checkValidity()) {
                    input.reportValidity();
                    return;
                }
            }

            // Lead Parcial
            if (currentStep.id === 'step1' && stepNum === 2) {
                const telefono = document.getElementById('telefono_basico').value;
                const nombre = document.getElementById('nombre_basico').value;

                const webhookUrl = 'https://n8n-n8n.gk97dq.easypanel.host/webhook/evolvehub-form';
                fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        source: 'lead_inicial_diagnostico',
                        data: { telefono, nombre, fecha: new Date().toISOString() }
                    })
                }).catch(e => console.log('Lead parcial guardado localmente o falló'));
            }

            // Next step
            showStep(stepNum);
        }

        // Prevent Enter from submitting the form unexpectedly
        document.getElementById('diagnosticoForm').addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
            }
        });

        async function calculateAndSubmit() {
            const currentStep = document.querySelector('.step.active');
            const inputs = Array.from(currentStep.querySelectorAll('input, select, textarea'));
            for (let input of inputs) {
                if (!input.checkValidity()) {
                    input.reportValidity();
                    return;
                }
            }

            // Show analyzing state
            document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
            document.getElementById('analyzingState').classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Collect form data
            const form = document.getElementById('diagnosticoForm');
            const formData = new FormData(form);
            const data = {};
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }

            // Calculation
            const ticketMedio = parseFloat(document.querySelector('input[name="ticket_medio"]:checked').dataset.value);
            const citasPerdidas = parseFloat(document.querySelector('input[name="citas_perdidas"]:checked').dataset.value);
            
            const penaltyLlamadas = parseFloat(document.querySelector('input[name="gestion_llamadas"]:checked').dataset.penalty);
            const penaltyWhatsapp = parseFloat(document.querySelector('input[name="gestion_whatsapp"]:checked').dataset.penalty);
            const penaltySeguimiento = parseFloat(document.querySelector('input[name="seguimiento"]:checked').dataset.penalty);
            
            const totalPenaltyPercent = penaltyLlamadas + penaltyWhatsapp + penaltySeguimiento;
            
            const baseLoss = ticketMedio * citasPerdidas;
            const adjustedLoss = baseLoss * (1 + (totalPenaltyPercent / 100));

            // +/- 30% range
            const minLoss = adjustedLoss * 0.70;
            const maxLoss = adjustedLoss * 1.30;

            function roundNice(num) {
                if (num < 100) return Math.round(num / 10) * 10;
                if (num < 1000) return Math.round(num / 50) * 50;
                return Math.round(num / 100) * 100;
            }

            const minLossRounded = roundNice(minLoss);
            const maxLossRounded = roundNice(maxLoss);

            data.perdida_semanal_min = minLossRounded;
            data.perdida_semanal_max = maxLossRounded;
            data.perdida_anual_min = minLossRounded * 52;
            data.perdida_anual_max = maxLossRounded * 52;

            // Wait 2 seconds
            setTimeout(async () => {
                document.getElementById('weeklyLossRange').textContent = `entre ${minLossRounded}€ y ${maxLossRounded}€`;
                document.getElementById('annualLossRange').textContent = `entre ${(minLossRounded * 52).toLocaleString('es-ES')}€ y ${(maxLossRounded * 52).toLocaleString('es-ES')}€`;
                
                document.getElementById('analyzingState').classList.remove('active');
                document.getElementById('resultState').classList.add('active');

                // Send to webhook
                try {
                    const webhookUrl = 'https://n8n-n8n.gk97dq.easypanel.host/webhook/evolvehub-form';
                    await fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            source: 'diagnostico_completo',
                            data: data
                        })
                    });
                } catch (error) {
                    console.error("Error al enviar el formulario final:", error);
                }
            }, 1800);
        }
    </script>"""

# Find the start and end of the form block
start_form = content.find('            <!-- Form Header & Progress -->')
end_form = content.find('            </div>\n        </div>\n    </main>')

if start_form != -1 and end_form != -1:
    content = content[:start_form] + header_and_form + '\n' + content[end_form:]
else:
    print("Could not find form block")

# Find the script block
start_script = content.find('    <script>\n        const dots =')
end_script = content.find('    <!-- Toasts -->')

if start_script != -1 and end_script != -1:
    content = content[:start_script] + script_block + '\n\n' + content[end_script:]
else:
    print("Could not find script block")

with open('diagnostico.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
