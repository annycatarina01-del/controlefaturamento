---
description: Workflow for creating modules and modifying code according to the Manual de Boas Práticas.
---

# Best Practices Workflows

This workflow follows the "Manual de Boas Práticas: O Guia Definitivo do Desenvolvedor Sênior".

## Task Flow: CREATE_NEW_MODULE

1. **Plan Identification**: List ALL files that will be created with their full paths.
2. **User Confirmation**: Wait for the user's "Pode prosseguir" or similar confirmation.
3. **Execution**: Generate code for EACH FILE, one by one, in separate blocks identified by the full path.

## Task Flow: MODIFY_EXISTING_CODE

1. **Interpretation**: Translate the natural language request (referring to "screens" or "buttons") into technical file paths using the `architecture_definition`.
2. **Plan Attack**: Present the plan, declaring the files identified and a summary of the change.
3. **Atomic Scope**: Confirm that NO other file will be affected and wait for user confirmation.
4. **Execution**: Generate ONLY the altered code block. Do NOT rewrite the entire file.

## General Rules (Applying to ALL Workflows)

- **MINIMAL_SCOPE_MODIFICATION**: Only touch the target function/file.
- **NO_INTERPRETATION**: Follow explicit instructions literally.
- **NO_ASSUMPTIONS**: Stop and ask if information is missing.
- **IMMUTABLE_ARCHITECTURE**: Do not change folder structure or responsibilities.
- **INPUT_LEGIBILITY**: All inputs must have background `#FFFFFF` and dark font.
- **Supabase Layer**: Access Supabase ONLY via `.service.ts` using the client in `src/lib/supabase.ts`.
