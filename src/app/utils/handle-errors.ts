

export class HandleErrors {

    static handleFirebaseErrors(error: any): string {
        let errorMessage: string;
      
        // Vérifier si l'erreur provient de Firebase et contient un code
        if (error.code) {
          switch (error.code) {
            // Erreurs liées à l'inscription et à la connexion
            case 'auth/invalid-email':
              errorMessage = 'L\'adresse e-mail est mal formatée.';
              break;
            case 'auth/user-disabled':
              errorMessage = 'Le compte associé à cet e-mail est désactivé.';
              break;
            case 'auth/user-not-found':
              errorMessage = 'Aucun utilisateur trouvé avec cette adresse e-mail.';
              break;
            case 'auth/wrong-password':
              errorMessage = 'Le mot de passe est incorrect.';
              break;
            case 'auth/email-already-in-use':
              errorMessage = 'Cet e-mail est déjà utilisé par un autre compte.';
              break;
            case 'auth/weak-password':
              errorMessage = 'Le mot de passe est trop faible. Il doit comporter au moins 6 caractères.';
              break;
            case 'auth/operation-not-allowed':
              errorMessage = 'Cette opération n\'est pas autorisée. Contactez le support.';
              break;

            case 'auth/invalid-login-credentials':
              errorMessage = 'Les identifiants de connexion sont invalides.';
              break;
      
            // Erreurs liées à la réinitialisation de mot de passe
            case 'auth/missing-email':
              errorMessage = 'Aucune adresse e-mail n\'a été fournie.';
              break;
            case 'auth/too-many-requests':
              errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard.';
              break;
      
            // Erreurs réseau
            case 'auth/network-request-failed':
              errorMessage = 'Erreur de réseau. Vérifiez votre connexion Internet.';
              break;
      
            // Erreurs génériques
            default:
              errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
              break;
          }
        } else {
          // Si l'erreur n'a pas de code (autre type d'erreur)
          errorMessage = 'Une erreur inattendue s\'est produite.';
        }
    
        return errorMessage;
    }
}