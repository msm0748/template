const copy = () => {
    let html = document.body.innerHTML;
    const copyTag = document.querySelector('.copy');
    // html = html.replace(copyTag.outerHTML, ''); // 복사 시 해당 클래스 제외시키기

    // 클립보드에 복사
    window.navigator.clipboard.writeText(html).then(() => {
        alert('복사 완료 !');
    });
};
