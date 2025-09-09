function createTypingEffect(elementId, text, options = {}) {
    const typingTextElement = document.getElementById(elementId);
    let textIndex = 0;
    let jamoIndex = 0;
    let completedText = '';
    let currentJamo = [];

    const typingSpeed = options.typingSpeed || 100;
    const delayBeforeBurn = options.delayBeforeBurn || 1500;
    const burnAnimationDuration = options.burnAnimationDuration || 2000;
    const loop = options.loop || false;

    function getJamo(char) {
        const uni = char.charCodeAt(0);
        if (uni < 0xac00 || uni > 0xd7a3) {
            return null;
        }
        const initialConsonants = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        const vowels = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
        const finalConsonants = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        const unicode = uni - 0xac00;
        const initialIndex = Math.floor(unicode / (21 * 28));
        const vowelIndex = Math.floor((unicode % (21 * 28)) / 28);
        const finalIndex = unicode % 28;
        const result = [initialConsonants[initialIndex], vowels[vowelIndex]];
        if (finalIndex !== 0) {
            result.push(finalConsonants[finalIndex]);
        }
        return result;
    }

    function combineJamo(initial, vowel, final) {
        const initialConsonants = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        const vowels = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
        const finalConsonants = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        
        const initialIndex = initialConsonants.indexOf(initial);
        const vowelIndex = vowels.indexOf(vowel);
        const finalIndex = finalConsonants.indexOf(final);
        
        if (initialIndex === -1 || vowelIndex === -1) {
            return '';
        }
        
        const charCode = 0xac00 + initialIndex * 21 * 28 + vowelIndex * 28 + finalIndex;
        return String.fromCharCode(charCode);
    }
    
    typingTextElement.style.display = 'block';

    function typeWriter() {
        if (textIndex < text.length) {
            const currentCharacter = text[textIndex];
            const jamo = getJamo(currentCharacter);

            let typingProgress = '';

            if (jamo) {
                if (jamoIndex === 0) {
                    currentJamo = jamo;
                }

                if (jamoIndex === 0) {
                    typingProgress = currentJamo[0];
                } else if (jamoIndex === 1) {
                    typingProgress = combineJamo(currentJamo[0], currentJamo[1], '');
                } else {
                    typingProgress = combineJamo(currentJamo[0], currentJamo[1], currentJamo[2]);
                }
                
                typingTextElement.innerHTML = completedText + typingProgress;
                jamoIndex++;

                if (jamoIndex === currentJamo.length) {
                    completedText += currentCharacter;
                    textIndex++;
                    jamoIndex = 0;
                }

            } else {
                if (currentCharacter === '\n') {
                    completedText += '<br>';
                } else {
                    completedText += currentCharacter;
                }
                typingTextElement.innerHTML = completedText;
                textIndex++;
                jamoIndex = 0;
            }
            
            setTimeout(typeWriter, typingSpeed);

        } else {
            setTimeout(() => {
                typingTextElement.classList.add('fade-out-burn');
                if (loop) {
                    setTimeout(() => {
                        typingTextElement.innerHTML = '';
                        typingTextElement.classList.remove('fade-out-burn');
                        createTypingEffect(elementId, text, options)();
                    }, burnAnimationDuration);
                }
            }, delayBeforeBurn);
        }
    }

    return typeWriter;
}

const igniteText = "당신의 상상력이 현실이 되는 가장 빠른 길, 프롬프트 마켓에서 만나보세요.✨";

const myTypingEffect = createTypingEffect("typing-text", igniteText, {
    typingSpeed: 40,
    delayBeforeBurn: 1500,
    burnAnimationDuration: 2000,
    loop: true 
});

myTypingEffect();