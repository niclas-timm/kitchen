<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Küchen-Einladung</title>
</head>
<body>
    <h1>Sie wurden eingeladen, {{ $kitchen->name }} beizutreten</h1>

    <p>{{ $kitchen->owner->name }} hat Sie eingeladen, in ihrer Küche zusammenzuarbeiten.</p>

    <p>Klicken Sie auf den folgenden Link, um die Einladung anzunehmen:</p>

    <p>
        <a href="{{ route('kitchen-invitations.accept', ['token' => $invitation->token]) }}">
            Einladung annehmen
        </a>
    </p>

    <p>Diese Einladung läuft am {{ $invitation->expires_at->translatedFormat('j. F Y \u\m H:i') }} Uhr ab.</p>

    <p>Falls Sie diese Einladung nicht erwartet haben, können Sie diese E-Mail ignorieren.</p>
</body>
</html>
